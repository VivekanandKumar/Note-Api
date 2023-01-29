var fetchRecord = 15;
var skip = 0;
var lastscroll = 0;
var scrollCached = 0;
function fullBodyScrollEvent(element) {
    try {
        var scrollHeight = element.scrollHeight - 1;
        var clientHeight = element.clientHeight;
        var scrollTop = element.scrollTop;
        var scrollPos = (clientHeight + scrollTop);
        //var tempScrollPos = scrollPos + 100;  
        if (scrollHeight <= scrollPos && lastscroll < scrollPos && !scrollCached) {
            var objParamsList = localStorage.objParamsList ? JSON.parse(localStorage.objParamsList) : null;
            if (objParamsList && objParamsList.functionName) {
                scrollCached = 1;
                $('#display_loading').removeClass('hideme');
                lastscroll = scrollPos;
                objParamsList.isLazyLoading = true;
                var func = new Function(
                    'return ' + objParamsList.functionName + '(' + JSON.stringify(objParamsList) + ');'
                )();
            }
        }
    } catch (error) {
        console.log('Error in fullBodyScrollEvent', error);
    }
}