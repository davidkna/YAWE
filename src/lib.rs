#![feature(async_await)]
#![recursion_limit = "512"]

mod app;
mod autocomplete_service;
mod utils;

use wasm_bindgen::prelude::*;

// This is the entry point for the web app
#[wasm_bindgen]
pub fn run_app() -> Result<(), JsValue> {
    utils::set_panic_hook();
    yew::start_app::<app::App>();
    Ok(())
}
