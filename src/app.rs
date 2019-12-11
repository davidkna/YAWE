use crate::autocomplete_service::AutocompleteService;
use serde_derive::{Deserialize, Serialize};
use serde_urlencoded;
use yew::{
    events::IKeyboardEvent,
    format::Json,
    html,
    services::storage::{Area, StorageService},
    Component, ComponentLink, Href, Html, Renderable, ShouldRender,
};

pub struct App {
    suggestions: Vec<String>,
    value: String,
    autocomplete_service: AutocompleteService,
    link: ComponentLink<Self>,
}

pub enum Msg {
    Input(String),
    CompleteUpdate(Vec<String>),
    Nop,
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            suggestions: Vec::new(),
            value: "".into(),
            autocomplete_service: AutocompleteService::new(
                "https://en.wikipedia.org/w/api.php".into(),
            ),
            link,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Input(text) => {
                self.suggestions = Vec::new();
                self.autocomplete_service
                    .get_suggestions(&text, self.link.send_back(Msg::CompleteUpdate));
                self.value = text;
            }
            Msg::CompleteUpdate(list) => {
                self.suggestions = list;
            }
            _ => {}
        };
        true
    }

    fn view(&self) -> Html<Self> {
        html! {<div>
            <input
                value=&self.value
                oninput=|e| Msg::Input(e.value)
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
