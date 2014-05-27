var SPC = {}
SPC.Ajax = SPC.Ajax || {};
SPC.Ajax.Action = function () {
    'use strict';
    return {
        get: function (url, data, onSuccess, onError) {
            data = data || {};
            $.ajax({
                url: url,
                data: data,
                headers: {
                    Accept: 'application/json;odata=verbose'
                },
                success: function (response) {
                    if (onSuccess) {
                        onSuccess(response);
                    }
                    new SPC.Dialogs.Messaging().showSuccessMessage(response);
                },
                error: function (response) {
                    if (onError) {
                        onError(response);
                    }
                    new SPC.Dialogs.Messaging().showErrorMessage(response);
                }
            });
        }
	};
};