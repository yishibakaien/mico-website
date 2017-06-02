'use strict';

function previewImage(file) {
    
    if (file.files && file.files[0]) {

        var reader = new FileReader();
        bind(reader, 'load', function(evt) {
            // alert('转码完毕图片地址为:', evt.target.result);
            wrapper.style.background = 'url(' + evt.target.result + ')';
        });
        
        reader.readAsDataURL(file.files[0]);
    }
}
