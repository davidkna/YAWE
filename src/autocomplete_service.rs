use failure::Error;
use js_sys::{Array, ArrayBuffer, Reflect, Uint8Array};
use serde::{de::DeserializeOwned, Serialize};
use serde_json;
use serde_urlencoded;
use std::{
    io,
    iter::{IntoIterator, Iterator},
};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::{spawn_local, JsFuture};
use web_sys::{window, AbortController, AbortSignal, RequestCache, RequestInit, Response};
use yew::callback::Callback;

pub(crate) struct AutocompleteService {
    api_url: String,
    abort_controller: Option<AbortController>,
}

#[derive(Serialize)]
struct AutocompleteRequest {
    format: String,
    action: String,
    search: String,
    suggest: bool,
    limit: usize,
    origin: String,
}
impl AutocompleteRequest {
    fn new(search_term: &str) -> Self {
        Self {
            format: "json".into(),
            action: "opensearch".into(),
            search: search_term.into(),
            suggest: true,
            limit: 10,
            origin: "*".into(),
        }
    }
}

impl AutocompleteService {
    pub(crate) fn new(api_url: String) -> Self {
        Self {
            api_url,
            abort_controller: None,
        }
    }

    pub(crate) fn get_suggestions(&mut self, query: &str, callback: Callback<Vec<String>>) {
        if query.trim() == "" {
            return;
        }
        let query_parameter = AutocompleteRequest::new(&query);
        let query_parameter = serde_urlencoded::to_string(query_parameter).unwrap();
        let url = format!("{}?{}", self.api_url, query_parameter);

        let abort_controller = AbortController::new().unwrap();
        let signal = abort_controller.signal();

        if let Some(controller) = self.abort_controller.replace(abort_controller) {
            controller.abort();
        }

        let future = async_get_suggestions(url, callback, signal);
        spawn_local(future);
    }
}

async fn async_get_suggestions(url: String, callback: Callback<Vec<String>>, signal: AbortSignal) {
    let suggestions: Vec<String> = send::<serde_json::Value>(&url, signal)
        .await
        .map(|body| serde_json::from_value(body[1].clone()).unwrap_or_default())
        .unwrap_or_default();

    callback.emit(suggestions);
}

async fn send<T: DeserializeOwned>(url: &str, signal: AbortSignal) -> Result<T, io::Error> {
    // Send the request.
    let window = window().expect("A global window object could not be found");
    let mut init = RequestInit::new();
    init.cache(RequestCache::ForceCache);
    init.signal(Some(&signal));
    let request = web_sys::Request::new_with_str_and_init(url, &init).unwrap();
    let promise = window.fetch_with_request(&request);
    let resp = JsFuture::from(promise).await.unwrap();
    let res: web_sys::Response = resp.dyn_into().unwrap();

    // Get the request body.
    let promise = res.array_buffer().unwrap();
    let resp = JsFuture::from(promise).await.unwrap();
    let buf: ArrayBuffer = resp.dyn_into().unwrap();
    let slice = Uint8Array::new(&buf);
    let mut body: Vec<u8> = vec![0; slice.length() as usize];
    slice.copy_to(&mut body);

    Ok(serde_json::from_slice(&body).map_err(|_| std::io::ErrorKind::InvalidData)?)
}
