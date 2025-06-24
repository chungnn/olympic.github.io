# Thử Thách Logic Hàng Ngày

Một trang web đơn giản giúp trẻ em phát triển tư duy logic thông qua các bài tập nhận dạng quy luật.

## Tính năng

### Phần dành cho trẻ em:
- Hiển thị dãy hình với quy luật đơn giản (tròn, vuông, tam giác)
- Giao diện tương tác với hiệu ứng đẹp mắt
- Phản hồi tức thì khi chọn đáp án
- Hiệu ứng pháo hoa khi trả lời đúng
- 5 mẫu thử thách khác nhau

### Phần dành cho bố mẹ:
- Kịch bản gợi ý cách hướng dẫn con
- Mẹo giúp khuyến khích trẻ tư duy
- Hướng dẫn cách giải thích khi trẻ chọn sai

## Cách sử dụng

1. Mở trang web trên trình duyệt
2. Bố mẹ đọc kịch bản ở phần dưới
3. Hướng dẫn con quan sát dãy hình và tìm quy luật
4. Để con tự chọn đáp án bằng cách bấm vào hình
5. Bấm "Thử Thách Mới" để tạo bài tập khác

## Cách triển khai lên GitHub Pages

1. Đẩy code lên repository `olympic.github.io`
2. Vào Settings của repository
3. Trong phần Pages, chọn source là `main branch`
4. Trang web sẽ có thể truy cập tại `https://[username].github.io/olympic.github.io`

## Cấu trúc file

- `index.html` - Giao diện chính
- `style.css` - Styling và hiệu ứng
- `script.js` - Logic tương tác và các thử thách
- `README.md` - Hướng dẫn này

## Tùy chỉnh thử thách

Để thêm thử thách mới, chỉnh sửa mảng `challenges` trong file `script.js`:

```javascript
{
    pattern: ['circle', 'square', 'circle', 'square'], // Dãy hình
    correct: 'circle', // Đáp án đúng
    script: 'Kịch bản cho bố mẹ...' // Hướng dẫn
}
```

Các hình có sẵn: `circle`, `square`, `triangle`
