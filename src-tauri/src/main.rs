#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    url: String,
}

fn main() {
    tauri::Builder::default()
        .on_page_load(|window, payload| {
            let url = String::from(payload.url());
            let pos = url.find("#");

            let window_ = window.clone();
            let _id = window.listen("frontend-loaded", move |event| {
                println!("got window event-name with payload {:?}", event.payload());

                if pos != None {
                    println!("{}", payload.url());
                    window_.emit("get-token", Payload { url: payload.url().into() }).unwrap();
                } else {
                    println!("{}", "No es url valida");
                }
            });
        })
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
