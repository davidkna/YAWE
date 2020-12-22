use http::{Request, Response};
use serde_derive::{Deserialize, Serialize};
use serde_json::value::Value;
use serde_urlencoded;
use yew::{
    events::InputData,
    format::{Json, Nothing},
    html,
    services::{
        fetch::{FetchOptions, FetchService, FetchTask},
        storage::{Area, StorageService},
    },
    Component, ComponentLink, Href, Html, Renderable, ShouldRender,
};

pub struct App {
    suggestions: Vec<String>,
    value: String,
    autcomplete_fetcher: Option<FetchTask>,
    link: ComponentLink<Self>,
    api_url: String,
}

pub enum Msg {
    Input(String),
    CompleteUpdate(Vec<String>),
    Noop,
}

struct AutocompleteItem {
    name: String,
    url: String,
}

#[derive(Serialize)]
struct AutocompleteRequest {
    format: &'static str,
    action: &'static str,
    search: String,
    redirects: &'static str,
    limit: usize,
    origin: &'static str,
}

impl AutocompleteRequest {
    fn new(search_term: &str) -> Self {
        Self {
            format: "json",
            action: "opensearch",
            search: search_term.into(),
            limit: 10,
            origin: "*",
            redirects: "resolve",
        }
    }
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            suggestions: Vec::new(),
            value: "".into(),
            autcomplete_fetcher: None,
            api_url: "https://en.wikipedia.org/w/api.php".into(),
            link,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Input(text) => {
                self.suggestions = Vec::new();
                let query = AutocompleteRequest::new(&text);
                let query = serde_urlencoded::to_string(query).unwrap();
                let url = format!("{}?{}", self.api_url, query);
                let request = Request::get(url).body(Nothing).unwrap();
                let task = FetchService::fetch(
                    request,
                    self.link
                        .callback(|response: Response<Json<Result<Value, anyhow::Error>>>| {
                            if let (meta, Json(Ok(body))) = response.into_parts() {
                                if meta.status.is_success() {
                                    return body[1]
                                        .as_array()
                                        .map(|list| {
                                            list.iter()
                                                .filter_map(|i| i.as_str().map(|s| s.to_string()))
                                                .collect()
                                        })
                                        .map(Msg::CompleteUpdate)
                                        .unwrap_or(Msg::Noop);
                                }
                            }
                            Msg::Noop
                        }),
                );
                self.autcomplete_fetcher = task.ok();
                self.value = text;
            }
            Msg::CompleteUpdate(list) => {
                self.suggestions = list;
            }
            _ => {}
        };
        true
    }

    fn change(&mut self, _props: Self::Properties) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        let input_callback = self.link.callback(|e: InputData| Msg::Input(e.value));
        html! {<div>
            <input
                value=&self.value
                oninput=input_callback
            />
            <ul>
                {
                    for self.suggestions.iter().map(|i| html! {
                        <li>{i}</li>
                    })
                }
            </ul>
        </div>
        }
    }
}
