// Shared functions

function dialog(header, text, yesNo = false) {
	const d = $.Deferred();
	$('<div id="back-dialog"></div>').appendTo($('body'));
	$('<div id="dialog-content"></div>').appendTo($('#back-dialog'));
	$('<div id="dialog_header">'+header+'</div>').appendTo($('#dialog-content'));
	$('<div id="dialog_text">'+text+'</div>').appendTo($('#dialog-content'));
	if (yesNo) {
		$('<button id="yes-btn">Yes</button>').appendTo($('#dialog-content')).click(() => {
			$('#back-dialog').remove();
			d.resolve();
		});
		$('<button id="yes-btn">No</button>').appendTo($('#dialog-content')).click(() => {
			$('#back-dialog').remove();
			d.reject();
		});
	} else {
		$('<button>OK</button>').appendTo($('#dialog-content')).click(() => {
			$('#back-dialog').remove();
			d.resolve();
		});
	}
	return d;
}