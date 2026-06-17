
/**
 * 숫자만 입력되도록 하는 함수
 * 사용법 : onkeyup="inputOnlyNumber(this)" onBlur="inputOnlyNumber(this)"
 * @param {evt} 이벤트
 */
function inputOnlyNumber(evt){
  isNumValue = evt.value.toString();
  if (isNumValue.match(/[^0-9]/g)) {
    isNumValue = isNumValue.replace(/[^0-9]/g,'');
    evt.value = isNumValue;
  }
}


/**
 * 숫자와 '-'만 입력되도록 하는 함수
 * 사용법 : onkeyup="inputOnlyNumber(this)" onBlur="inputOnlyNumber(this)"
 * @param {evt} 이벤트
*/
function inputNumberAndDash(evt){
  isNumValue = evt.value.toString();
  if (isNumValue.match(/[^0-9-]/g)) {
    isNumValue = isNumValue.replace(/[^0-9-]/g,'');
    evt.value = isNumValue;
  }
}


/**
 * 모든 글자를 소문자로 변환
 * 사용법 : onBlur="inputOnlyLowerCase(this)"
 * @param {evt} 이벤트
 */
function inputOnlyLowerCase(evt){
  var strValue = evt.value.toString();
  if (strValue.match(/[^a-z]/g)) {
    strValue = strValue.toLowerCase();
    evt.value = strValue;
  }
}


/**
 * Enter key call function
 * 사용법 : onkeypress="onkeypressEnter(this, 호출함수);"
 */
function onkeypressEnter(obj, callFunction) {
  if(!window.event) {
      obj.addEventListener('keydown',function keyEvtHandler(e) {
        keyValue = e.keyCode;
      },false);
  } else {
      keyValue = window.event.keyCode;
  }

  if(keyValue == 13) callFunction();
  return;
}

/**
 * 공백이 입력되지 않도록 하는 함수
 * 사용법 : onkeyup="noInputSpace(this)" onBlur="noInputSpace(this)"
 * @param {evt} 이벤트
 */
function noInputSpace(evt){
  isValue = evt.value.toString();
  if (isValue.match(/[\s]/g)) {
    isValue = isValue.replace(/[\s]/g,'');
    evt.value = isValue;
  }
}


/**
 * 사용자 알림 메세지
 * @param subject 제목
 * @param content1 내용1
 * @param content2 내용2
 * @param content3 내용3
 */
function validateAlert(subject, content1, content2, content3, content4){
    var msg = "";
    if (subject != null && subject != "" && subject != undefined){
      msg = "※" + subject + "\n\n";
    }
    if (content1 != null && content1 != "" && content1 != "undefined"){
      msg = msg + content1 + "\n";
    }
    if (content2 != null && content2 != "" && content2 != "undefined"){
      msg = msg + content2 + "\n";
    }
    if (content3 != null && content3 != "" && content3 != "undefined"){
      msg = msg + content3 + "\n";
    }
    if (content4 != null && content4 != "" && content4 != "undefined"){
      msg = msg + content4 + "\n";
    }
    msg = msg + "\n";

    alert(msg);
}

/**
 * 탭변경스크립트
 */
function tabChange(tabType,idx,obj){
    var curCls = $(obj).attr('class');
    if(curCls !='over'){
        $("div."+tabType+" a").removeClass("over");
        $(obj).addClass('over');
        $("#"+idx).show().siblings().hide();
    }
}

/**
 * 팝업창띄우기
 * @param {uri} 팝업창띄울 URL정보
 * @param {winname} 팝업창 이름
 * @param {w} width
 * @param {h} height
 * @param {s} scroll여부 (0-no:noscroll, 1-yes:scroll)
 * @param {r} resize여부 (0-no:noresize, 1-yes:resize)
 * @author 김동완
 */
function winPopup(uri,winname,w,h,s,r){

    if(self.screen) {
        var tempTop  = (screen.height - parseInt(h))/2 ;
        var tempLeft = (screen.width - parseInt(w))/2;
    }else {
        var tempTop = 0;
        var tempLeft = 0;
    }

    var newwin = window.open('about:blank',winname,'width='+w+',height='+h+',top='+tempTop+',left='+tempLeft+',status=no,scrollbars='+s+',resizable='+r);
    if (newwin == null){
        alert("팝업 차단기능 혹은 팝업차단 프로그램이 동작중입니다. 팝업 차단 기능을 해제한 후 다시 시도하세요.");
    }else{
        newwin = window.open(uri,winname,'width='+w+',height='+h+',top='+tempTop+',left='+tempLeft+',status=no,scrollbars='+s+',resizable='+r);
        return newwin;
        newwin.focus();
    }
}

/**
 * 컴마지운후 값 리턴.
 * @author 김동완
 */
function delCommaRet(fname) {
    var value1 = fname;
    var value2 = fname.length;
    var sVal = "";
    var j = 0;
    for (var i=value2; i>=0; i--) {
        var tmp = value1.charAt(i);
        if (tmp != ",") {
            sVal = tmp + sVal;
        }
    }
    return sVal;
}

/**
 * 컴마 붙이기
 * @param num
 * @returns
 */
function formatCurrency(num){
    var sFirst = num.toString();  //변환전 문자열
    var sSecond = sFirst;    //변환후 문자열
    var sDot = "";      //소수점이하의 문자열
    var sTot ="";      //전체문자열

    if (sFirst.indexOf(".", 0) > 0) {
        sSecond = sFirst.substr(0, sFirst.indexOf(".", 0));
        sDot = sFirst.substring(sFirst.indexOf(".", 0), sFirst.length);
    }

    var len = sSecond.length;

    if (sSecond > 1) {
        while(len > 3) {
            len -= 3;
            sTot = ","+ sSecond.substr(len,3) + sTot;
        }
        return sSecond.substr(0,len) + sTot + sDot;
    } else {
        return sFirst;
    }
}

/**
 * 사업자 번호 '-'추가하기
 * @param businessNum
 * @returns
 */
function crnMaskup(businessNum)
{
    if(businessNum.length <= 3)
    {
        return;
    } else if(businessNum.length > 3 && businessNum.length <= 5)
    {
        return businessNum.substr(0,3) + "-" + businessNum.substring(3);
    }else if (businessNum.length > 5 && businessNum.length <= 10)
    {
        return businessNum.substr(0,3) + "-" + businessNum.substr(3,2) + "-" + businessNum.substring(5);
    }else if(businessNum.length > 10) {
    	return businessNum.substr(0,3) + "-" + businessNum.substr(3,2) + "-" + businessNum.substr(5,5);
    }
}