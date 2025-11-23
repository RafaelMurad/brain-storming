# ImageKit

**Image Processing & Optimization API** - Resize, transform, and optimize images on-the-fly.

## Features
- **On-the-fly Transforms** - Resize, crop, rotate images via URL
- **Format Conversion** - Convert to WebP, AVIF, PNG, JPEG
- **Quality Control** - Optimize file size with quality settings
- **Effects** - Blur, grayscale, flip, rotate
- **URL-based Transforms** - Simple URL pattern for CDN integration

## Quick Start
```bash
npm install && npm run db:push && npm run dev
```
Server runs on `http://localhost:3013`

## Usage

### Upload Image
```bash
curl -X POST http://localhost:3013/api/v1/upload \
  -H "X-API-Key: YOUR_KEY" \
  -F "image=@photo.jpg"
```

### Transform via API
```bash
# Resize to 300x200, convert to WebP
curl "http://localhost:3013/api/v1/transform/IMAGE_ID?w=300&h=200&format=webp&quality=80" \
  -H "X-API-Key: YOUR_KEY" --output resized.webp
```

### URL-based Transform (Public)
```
/img/w_300,h_200,f_webp,q_80/IMAGE_ID
/img/w_100,h_100,fit_cover,gray_true/IMAGE_ID
```

### Transform Options
| Param | Description |
|-------|-------------|
| `w` | Width in pixels |
| `h` | Height in pixels |
| `fit` | cover, contain, fill, inside, outside |
| `format` / `f` | jpeg, png, webp, avif |
| `quality` / `q` | 1-100 |
| `blur` | Blur radius (0.3-1000) |
| `grayscale` / `gray` | Convert to grayscale |
| `rotate` | Rotation angle |
| `flip` | Flip vertically |
| `flop` | Flip horizontally |

## Integration Example
```html
<!-- Original -->
<img src="/uploads/abc123.jpg">

<!-- Thumbnail -->
<img src="/img/w_150,h_150,fit_cover/abc123">

<!-- WebP with quality -->
<img src="/img/w_800,f_webp,q_75/abc123">
```

## License
MIT
