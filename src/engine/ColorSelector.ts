let hsvToRgb = ( hue:number, saturation:number, value:number): [number,number,number] => {

	if (saturation == 0.0) return [value * 255,value * 255,value * 255];

    let r:number; 
    let g:number; 
    let b:number;
		if (hue == 360.0) hue = 0.0;
		else hue /= 60.0;	

		let i = Math.floor(hue);
		let f = hue - i;

		let p = value * (1.0 - saturation);
		let q = value * (1.0 - (saturation * f));
		let t = value * (1.0 - (saturation * (1.0 - f)));
        switch (i) {
            case 0: {
                r = value;
                g = t;
                b = p;
                break;
            }
            case 1: {
                r = q;
			    g = value;
			    b = p;
                break;
            }
            case 2: {
                r = p;
                g = value;
                b = t;
                break;
            }
            case 3: {
                r = p;
                g = q;
                b = value;
                break;
            }
            case 4: {
                r = t;
                g = p;
                b = value;
                break;
            }
            default: {
                r = value;
                g = p;
                b = q;
                break;
            }
        }
    return [r * 255,g * 255,b * 255]

}

export let getImage = (hue:number) => {
    let buffer = new Uint8ClampedArray(255*255*4);
    let color = hsvToRgb(hue, 1.,1.);
    for(let y = 0; y < 255; y++) {
        for(let x = 0; x < 255; x++) {
            let  pos = (y * 255 + x) * 4;

            let height: number = 1-y/255;
            let width: number = 1-x/255;
            
            buffer[pos  ] = (color[0]+((255-color[0])*width))*height;
            buffer[pos+1] = (color[1]+((255-color[1])*width))*height;
            buffer[pos+2] = (color[2]+((255-color[2])*width))*height;
            buffer[pos+3] = 255;  
        }
    }
    return buffer;
}