#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    tauri::Builder
        ::default()
        .on_page_load(|window, payload| {
            let url = String::from(payload.url());
            let pos = url.find("#");

            if pos != None {
                window.emit("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
                println!("{}", payload.url());
            }
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}