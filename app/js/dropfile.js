(function($) {

	var o = {
		script : 'upload.php'
	};
	$.fn.dropfile = function(oo) {
		if(oo) $.extend(o,oo);
		this.each(function() {
			$('<span>').append('Drop your picture !').appendTo(this);
			$('<span>').addClass('progress').appendTo(this);
			$(this).bind({
				dragenter : function(e) {
					e.preventDefault();
				},
				dragover : function(e) {
					e.preventDefault();
					$(this).addClass('dropfileHover');
				},
				dragleave : function(e) {
					e.preventDefault();
					$(this).removeClass('dropfileHover');
				}
			});
			this.addEventListener('drop', function(e) {
				e.preventDefault();
				var files = e.dataTransfer.files;
				upload(files,$(this),0);
			}, false);
		});

		function upload(files,area,index) {
			var boundary = Math.random();
			var file = files[index];
			var xhr = new XMLHttpRequest();
			var progress =  area.find('.progress');
			// Events
			xhr.addEventListener('load', function(e) {
				var json = jQuery.parseJSON(e.target.responseText);
				area.removeClass('dropfileHover');
				progress.css({height:0});
				if(json.error) {
					alert(json.error);
					return false;
				}
				area.append(json.content);
			}, false);

			xhr.upload.addEventListener('progress', function(e) {
				if(e.lengthComputable) {
					var perc = (Math.round(e.loaded/e.total) * 100) + '%';
					progress.css({height:perc}).html(perc);

				}
				
			}, false);
			xhr.open('POST',o.script,true);
			xhr.setRequestHeader('content-type', 'multipart/form-data; boundary='.boundary); 
			xhr.setRequestHeader('x-file-type', file.type);
			xhr.setRequestHeader('x-file-size', file.fileSize);
			xhr.setRequestHeader('x-file-name', file.fileName);
			xhr.send(file);
		}
	}
})(jQuery);