#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::io::Cursor;

use math::round;
use image::{RgbaImage, Rgb, ImageOutputFormat};



fn image_to_base64(img: &RgbaImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png).unwrap();
    let res_base64 = base64::encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

// const IMG: ImageBuffer<image::Rgba<u8>, Vec<u8>> = RgbaImage::from_fn(256, 256, |x, y| {
//     let height: f32 = (1f32-(y as f32/255f32)).into();
//     let width: f32 = (1f32-x as f32/255f32).into();
//     let r = (255f32*height) as u8;
//     let g = (255f32*width*height) as u8;
//     let b = (255f32*width*height) as u8;
//     image::Rgba([r,g,b,255])
// });


fn hsv_to_rgb(mut hue:f32, saturation:f32, value:f32) -> Rgb<f32> {

	if saturation == 0.0 {
        Rgb([(value * 255f32),(value * 255f32),(value * 255f32)]);
	}

    let r:f32; let g:f32; let b:f32;
		if hue == 360.0 {
            hue = 0.0;
        }
		else {
            hue /= 60.0;
        }
			

		let i = round::floor(hue.into(), 0);
		let f = hue - i as f32;

		let p = value * (1.0 - saturation);
		let q = value * (1.0 - (saturation * f));
		let t = value * (1.0 - (saturation * (1.0 - f)));
        match i {
            0.0 => {
                r = value;
                g = t;
                b = p;  
            }
            1.0 => {
                r = q;
			    g = value;
			    b = p;
            }
            2.0 => {
                r = p;
                g = value;
                b = t;
            }
            3.0 => {
                r = p;
                g = q;
                b = value;
            }
            4.0 => {
                r = t;
                g = p;
                b = value;
            }
            _ => {
                r = value;
                g = p;
                b = q;
            }
        }
    Rgb([(r * 255f32),(g * 255f32),(b * 255f32)])

}

#[tauri::command(async)]
async fn get_image(hue:f32) -> String {
    // IMAGE PROCESSINS HUEROTATE
    let color = hsv_to_rgb(hue, 1.,1.);
    let img = RgbaImage::from_fn(256, 256, |x, y| {
        let height: f32 = (1f32-(y as f32/255f32)).into();
        let width: f32 = (1f32-x as f32/255f32).into();
        let r = ((color[0]+((255.-color[0])*width))*height) as u8;
        let g = ((color[1]+((255.-color[1])*width))*height) as u8;
        let b = ((color[2]+((255.-color[2])*width))*height) as u8;
        image::Rgba([r,g,b,255])
    });
    image_to_base64(&img)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
