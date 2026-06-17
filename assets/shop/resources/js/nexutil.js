/**
 * @fileoverview 브라우저비교 및 JS상속, 클래스 생성관련 스크립트 모음
 * @author 김동완
 * @version 1.0
 */



/*  Browser Version Check  Start */
 var sUserAgent = navigator.userAgent;
var fAppVersion = parseFloat(navigator.appVersion);

/**
 * 브라우저 버전 비교
 * @param {string}
 * @param {string}
 * @return 0/1
 */
function compareVersions(sVersion1, sVersion2) {
	var aVersion1 = sVersion1.split(".");
	var aVersion2 = sVersion2.split(".");

	if (aVersion1.length > aVersion2.length) {
		for (var i=0; i < aVersion1.length - aVersion2.length; i++) {
			aVersion2.push("0");
		}
	} else if (aVersion1.length < aVersion2.length) {
		for (var i=0; i < aVersion2.length - aVersion1.length; i++) {
			aVersion1.push("0");
		}
	}
	for (var i=0; i < aVersion1.length; i++) {
		if (aVersion1[i] < aVersion2[i]) {
			return -1;
		} else if (aVersion1[i] > aVersion2[i]) {
			return 1;
		}
	}
	return 0;
}



/** Opera */
var isOpera = sUserAgent.indexOf("Opera") > -1;
var isOpera7 = isOpera8 = isOpera9 =isOpera10 = false;
if (isOpera) {
	if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
	 var oprversion=new Number(RegExp.$1);
	 if (oprversion>=10) isOpera10 = true;
	 else if (oprversion>=9) isOpera9 = true;
	 else if (oprversion>=8) isOpera8 = true;
	 else if (oprversion>=7) isOpera7 = true;
	}
}




/** KHTML, Konqueror */
var isKHTML = sUserAgent.indexOf("KHTML") > -1 || sUserAgent.indexOf("Konqueror") > -1  || sUserAgent.indexOf("AppleWebKit") > -1;

var isSafari1 = isSafari1_2 = false;
var isKonq2_2 = isKonq3 = isKonq3_1 = isKonq3_2 = false;
var isSafari = false;
if (isKHTML) {
	isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
	isKonq = sUserAgent.indexOf("Konqueror") > -1;

	if (isSafari) {
		var reAppleWebKit = new RegExp("AppleWebKit\\/(\\d+(?:\\.\\d*)?)");
		reAppleWebKit.test(sUserAgent);
		var fAppleWebKitVersion = parseFloat(RegExp["$1"]);
		isSafari1 = fAppleWebKitVersion >= 85;
		isSafari1_2 = fAppleWebKitVersion >= 124;
	} else if (isKonq) {
		var reKonq = new RegExp("Konqueror\\/(\\d+(?:\\.\\d+(?:\\.\\d)?)?)");
		reKonq.test(sUserAgent);
		isKonq2_2 = compareVersions(RegExp["$1"], "2.2") >= 0;
		isKonq3 = compareVersions(RegExp["$1"], "3.0") >= 0;
		isKonq3_1 = compareVersions(RegExp["$1"], "3.1") >= 0;
		isKonq3_2 = compareVersions(RegExp["$1"], "3.2") >= 0;
	}
}


// Internet Explorer
var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
var isIE4 = isIE5 = isIE5_5 = isIE6 = isIE7 = isIE8 = false;
if (isIE) {
	var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
	reIE.test(sUserAgent);
	var fIEVersion = parseFloat(RegExp["$1"]);
	isIE4 = fIEVersion >= 4  && fIEVersion < 5;
	isIE5 = fIEVersion >= 5  && fIEVersion < 5.5;
	isIE5_5 = fIEVersion >= 5.5  && fIEVersion < 6.0;
	isIE6 = fIEVersion >= 6.0 && fIEVersion < 7.0;
	isIE7 = fIEVersion >= 7.0 && fIEVersion < 8.0;
	isIE8 = fIEVersion >= 8.0 ;
}


// Mozilla 여부
var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isKHTML;
var isMoz1 = sMoz1_4 = isMoz1_5 = false;

if (isMoz) {
	var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
	reMoz.test(sUserAgent);
	isMoz1 = compareVersions(RegExp["$1"], "1.0") >= 0;
	isMoz1_4 = compareVersions(RegExp["$1"], "1.4") >= 0;
	isMoz1_5 = compareVersions(RegExp["$1"], "1.5") >= 0;
}

var isNS4 = !isIE && !isOpera && !isMoz && !isKHTML && (sUserAgent.indexOf("Mozilla") == 0) && (navigator.appName == "Netscape") && (fAppVersion >= 4.0 && fAppVersion < 5.0);
var isNS4 = isNS4_5 = isNS4_7 = isNS4_8 = false;

if (isNS4) {
	isNS4 = true;
	isNS4_5 = fAppVersion >= 4.5;
	isNS4_7 = fAppVersion >= 4.7;
	isNS4_8 = fAppVersion >= 4.8;
}


var isFF = !isIE && !isOpera && isMoz && !isKHTML && (sUserAgent.indexOf("Mozilla") == 0) && (navigator.appName == "Netscape");
var isFF1 = isFF2 = isFF3 = false;
if(isFF){
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
	 var ffversion=new Number(RegExp.$1);
	 if (ffversion>=3)
	  	isFF3 = true;
	 else if (ffversion>=2)
	 	isFF2 = true;
	 else if (ffversion>=1)
	  	isFF1 = true;
	}
}


//구글 크롬 버전체크 추가 2008.09.03
var isChrome = !isIE && !isFF && !isOpera && !isMoz && !isKonq && isSafari && isKHTML && (sUserAgent.indexOf("Mozilla") == 0) && (sUserAgent.indexOf("Chrome") != -1) && (navigator.appName == "Netscape");
var isChrome02 = false;

if(isChrome){
    if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
        var ffversion=new Number(RegExp.$1);
        if(parseFloat(ffversion) >= parseFloat('0.2'))
            isChrome02 = true;
    }
}


/**
 * XP인지 아닌지 판별함수
 * @return {boolean} true/false
 */
function isXP(){
	var agent = window.navigator.userAgent;
	if(agent.indexOf("MSIE")!= -1 && agent.indexOf("5.1") !=-1)
	    return true;     //SP1
    else
        return false;
}

/**
 * XP의 ServicePack2인지 처리함수
 * @return {boolean} true/false
 */
function isXPSP2(){
    var tmp_MSIE = window.navigator.userAgent.indexOf("MSIE");
    if(tmp_MSIE && window.navigator.userAgent.indexOf("SV1") > tmp_MSIE){
        return true;     //SP2
    }else{
        return false;
    }
}


/* IE 6 의 백그라운드 flickering방지  */
try { document.execCommand( "BackgroundImageCache", false, true); } catch(e) {}




/**
 * 마우스 원천봉쇄
 */
function dontMouseRight(e) {
    evt = e || event;
    try{
        if (document.all){
            if(evt.button == 2 || evt.button == 3) {
                ignoreEvent(evt);
                return false;
            }
        }else {
            if(evt.which == 3 || evt.which == 2) {
                ignoreEvent(evt);
                return false;
            }
        }
    }catch(ex){
        return false;
    }
}


/**
 * 이벤트 동작 무시!
 */
function ignoreEvent(evt){
    if(window.event){
        window.event.keyCode = 0;
        window.event.cancelBubble = true;
        window.event.returnValue = true;
    }else{
        evt.stopPropagation();
        evt.preventDefault();
        evt.initEvent;
    }
    return false;
}



/**
 * 페이지 로딩시 실행될 함수
 */
function onLoadHandler(){

    //마우스 오른쪽 막기
    if(document.attachEvent){
        window.document.attachEvent("onmousedown", dontMouseRight );
        window.document.attachEvent("oncontextmenu", ignoreEvent );
        window.document.attachEvent("ondragstart", ignoreEvent );
        //window.document.attachEvent("onselectstart", ignoreEvent );

    } else{
        if(!isFF3) window.captureEvents(Event.MOUSEDOWN);
        window.document.addEventListener("mousedown", dontMouseRight , false);
        window.document.addEventListener("contextmenu", ignoreEvent , false);
        window.document.addEventListener("dragstart", ignoreEvent , false);
        //window.document.addEventListener("selectstart", ignoreEvent , false);
        if(window.document.body.currentStyle){
            window.document.body.currentStyle = "-moz-user-focus: ignore; -moz-user-input: disabled; -moz-user-select: none; ";
        }else {
            window.document.body.cssStyle = "-moz-user-focus: ignore; -moz-user-input: disabled; -moz-user-select: none; ";
        }
    }

    /* input,textarea를 제외하고 select막기
    document.onmousemove = function(evt){
        var evt = evt || window.event;
        var obj = (evt.srcElement) ? evt.srcElement : evt.target;
        if(obj.tagName.toLowerCase()=='input' && obj.tagName.toLowerCase() != "textarea"){
            if(document.selection){//ie
                try{
                    document.selection.empty();
                }catch(err){}
                evt.returnValue = false;
            }else {
                try{
                    window.getSelection().removeAllPages();
                }catch(err){}
                evt.preventDefault();
            }
        }
    }*/



    document.body.onkeydown =  function(evt){
        var evt = evt || window.event;
        var obj = (evt.srcElement) ? evt.srcElement : evt.target;

        //백스페이스 막기
        if(evt.keyCode == 8 && obj.tagName.toLowerCase() != "input" && obj.tagName.toLowerCase() != "textarea"){

    		if(window.event) {
                window.event.keyCode = 0;
                window.event.cancelBubble = true;
                window.event.returnValue = true;
                return;
    		}else {
    		    evt.stopPropagation();
    		    evt.preventDefault() ;
    		}
        }
    }


    //입력필드에 값 검사하기
    document.body.onkeyup = function(evt){
        var evt = evt || window.event;
        var obj = (evt.srcElement) ? evt.srcElement : evt.target;
        if(obj.tagName.toLowerCase() == "input" || obj.tagName.toLowerCase() == "textarea"){
            var val = obj.value;
            if(val.indexOf("<") != -1 ){
                obj.value = val.replace("<","[");
            }else if(val.indexOf(">") != -1 ){
                obj.value = val.replace(">","]");
            }else if ( val.indexOf("script") != -1 ){
                obj.value = val.replace("script","스크립트");
            }
        }
    }





    //combo박스 마우스 휠스크롤 막기(Ajax 호출방지)
    var cmbObjs = document.getElementsByTagName('select');
    for(var i=0,len = cmbObjs.length; i < len ; i++){
        if(document.attachEvent){
            cmbObjs[i].attachEvent("onmousewheel", ignoreEvent );
        }else{
            cmbObjs[i].addEventListener("mousewheel", ignoreEvent , false);
        }
    }
}


/**
 * 페이지 로딩시 실행될 함수
 */
//if( typeof(onLoadHandler)=="function" ){ window.onload = onLoadHandler; }


/* CSRF 처리 : XSS Cross Site Script봉쇄
var curPageXSS = window.location.search;
if(curPageXSS.indexOf("script") != -1 || curPageXSS.indexOf("<") != -1 || curPageXSS.indexOf("\'") != -1 || curPageXSS.indexOf("%3C") != -1  ) {
    window.top.location.replace("/");
}*/


/**
* 즐겨찾기 등록하기
* 사용법 : onclick="CreateBookmarkLink('즐겨찾기제목','http://techbug.tistory.com');"
* @param title
* @param urlStr
*/
function CreateBookmarkLink(title,urlStr) {
    url = urlStr;
    //FF
    if (window.sidebar) {
        window.sidebar.addPanel(title, url,"");
    }
    //IE
    else if( window.external ) {
        window.external.AddFavorite( url, title);
    }
    //Opera
        else if(window.opera && window.print) {
        return true;
    }
}


/**
* 시작페이지 설정
* 사용법 : onclick="startPage(this,'http://techbug.tistory.com');"
* @param Obj
* @param urlStr
*/
function startPage(Obj,urlStr){
    if (document.all && window.external){
        Obj.style.behavior='url(#default#homepage)';
        Obj.setHomePage(urlStr);
    } else {

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



function yearMonthImgTrans(str,color,imgDir){
	var tmpStr = str;
	var len = str.length;
	var imgPathStr;
	for( var i=0; i < len ; i++){
		tmpStr = str.charAt(i)

		if(tmpStr=='.'){
			imgPathStr = "<img src='"+ imgDir + "resources/img/no_dot.gif' alt='.' />"
		}else{
			imgPathStr = "<img src='"+ imgDir + "resources/img/no_"+color+"_"+ tmpStr + ".gif'  alt='"+tmpStr+"' />"
		}
		document.write(imgPathStr);
	}
	document.write("<img src='"+imgDir+"resources/img/no_dot.gif' alt='.'  />");
}



function showSaleTerm(startDate, endDate, Obj){

	var sd = parseInt(startDate);
	var ed = parseInt(endDate);

    if(sd == ed){
        var tdObj = (document.getElementById("sTd_"+sd)) ? document.getElementById("sTd_"+sd) : null;
        if(tdObj !=null) {
			tdObj.style.backgroundImage="url("+DOC.ROOT+"resources/img/arr_oneday.gif)";
			tdObj.style.backgroundRepeat = "no-repeat";
			tdObj.style.backgroundPosition = "top right";
        }
    }else {
    	for(var i= sd ; i <= ed ; i++){
    		var tdObj = (document.getElementById("sTd_"+i)) ? document.getElementById("sTd_"+i) : null;
    		if(tdObj !=null) {
    			if(i==sd){
    				tdObj.style.backgroundImage="url("+DOC.ROOT+"resources/img/arr_first.gif)";
    				tdObj.style.backgroundRepeat = "no-repeat";
    				tdObj.style.backgroundPosition = "top right";
    			}else if(i==ed){
    				tdObj.style.backgroundImage="url("+DOC.ROOT+"resources/img/arr_last.gif)";
    				tdObj.style.backgroundRepeat = "no-repeat";
    				tdObj.style.backgroundPosition = "top left";
    			}else {
    				tdObj.style.backgroundImage="url("+DOC.ROOT+"resources/img/arr_mid.gif)";
    				tdObj.style.backgroundRepeat = "repeat-x";
    			}
    		}
    	}
    }
}

function hideSaleTerm(sd,ed,Obj){
	for(i = sd ; i <=ed ; i++){
		var tdObj = (document.getElementById("sTd_"+i)) ? document.getElementById("sTd_"+i) : null;
		if(tdObj !=null) {
			tdObj.style.background="";
			tdObj.style.backgroundColor="#F1F1F1";
		}
	}
}



/**
 * tag 객체의 위치값 및 너비/높이값을 반환한다.
 * @param {objId} DOM객체 : document.getElementById()
 * @return {ret} left,top,width,height 를 반환한다.
 * @author 김동완
 * @since 2008.06.25 FF3 패치
 */
function getBounds(objId){
	var ret = new Object();
	var tag = document.getElementById(objId);

	if(tag !=null && tag != undefined ){
		if(tag.getBoundingClientRect){ //IE, FF3
			var rect = tag.getBoundingClientRect();
			ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
			ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop);
			ret.width = rect.right - rect.left;
			ret.height = rect.bottom - rect.top +1; // +1 = Moz와 맞춤
		} else  if (document.getBoxObjectFor) { // gecko 엔진 기반 FF3제외
			var box = document.getBoxObjectFor(tag);
			ret.left = box.x;
			ret.top = box.y;
			ret.width = box.width;
			ret.height = box.height;
		}else {
			ret.left = tag.offsetLeft;
			ret.top = tag.offsetTop;
			ret.width = tag.offsetWidth;
			ret.height = tag.offsetHeight  + 3;  // +1 = Moz와 맞춤
			var parent = tag.offsetParent;
			if (parent != tag) {
				while (parent) {
					ret.left += parent.offsetLeft;
					ret.top += parent.offsetTop;
					parent = parent.offsetParent;
				}
			}
			// 오페라와 사파리의 'absolute' postion의 경우 body의 offsetTop을 잘못 계산 보정
			var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && getStyle(tag, 'position') == 'absolute' )) {
				ret.top -= document.body.offsetTop;
			}

		}
		return ret;
	}
}


function getPos(tag){
	var ret = new Object();

	if(tag !=null && tag != undefined ){
		if(tag.getBoundingClientRect){ //IE, FF3
			var rect = tag.getBoundingClientRect();
			ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
			ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop);
			ret.width = rect.right - rect.left;
			ret.height = rect.bottom - rect.top +1; // +1 = Moz와 맞춤
		} else  if (document.getBoxObjectFor) { // gecko 엔진 기반 FF3제외
			var box = document.getBoxObjectFor(tag);
			ret.left = box.x;
			ret.top = box.y;
			ret.width = box.width;
			ret.height = box.height;
		}else {
			ret.left = tag.offsetLeft;
			ret.top = tag.offsetTop;
			ret.width = tag.offsetWidth;
			ret.height = tag.offsetHeight  + 3;  // +1 = Moz와 맞춤
			var parent = tag.offsetParent;
			if (parent != tag) {
				while (parent) {
					ret.left += parent.offsetLeft;
					ret.top += parent.offsetTop;
					parent = parent.offsetParent;
				}
			}
			// 오페라와 사파리의 'absolute' postion의 경우 body의 offsetTop을 잘못 계산 보정
			var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && getStyle(tag, 'position') == 'absolute' )) {
				ret.top -= document.body.offsetTop;
			}

		}
		return ret;
	}
}

/**
 * 문자열의 공백을 제거한다.
 * @param {objVal} 문자열
 * @return {String} 공백을 제거한 문자열을 반환한다.
 * @author 김동완
 */
function trim(objVal){
    return objVal.replace(new RegExp("(^\\s*)|(\\s*$)", "g"), "");
}

/**
 * String값을 특정 단어로 치환한다. targetStr과 replaceStr이 같으면 안된다.
 * @param {targetStr} 치환할 단어
 * @param {replaceStr} 바꿀단어
 * @return {String}
 */
String.prototype.replaceAll = function(targetStr,replaceStr){
	var string = this.toString();
     var tmp = trim( string );

	//속도면에서 찾이가 있겠지만 replaceStr안에 targetStr이 있을 경우 무한루프 도는것을 방지한다.
	if(replaceStr.indexOf(targetStr) > -1 ) {
		return tmp.split(targetStr).join(replaceStr);
	}

     if( tmp == null || targetStr == null || targetStr == "" || replaceStr == null || targetStr == replaceStr ){
         return tmp;
     }else{
         while( tmp.indexOf( targetStr ) > -1 ){
             tmp = tmp.replace( targetStr, replaceStr );
         }
         return tmp;
     }
}




/* =================================  날짜관련 Lib Start================================== */
/**
 * 날짜형 YYYY-MM-DD 설정 (20080707 -> 2008-07-07)
 * @param {int} date 데이트형 20080707
 */
function setDate(date){
	date = date.replace(/[^0-9]/g, "");
	return date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
}

/**
 * 날짜 합산
 * @param {int} date 날짜(20080707)
 * @param {int} day 합산할 일자 (15)
 * @return {int} 계산된 날짜 (20080722)
 */
function dateAdd(date, day){
	var cDate = null;
	var yyyy;
	var mm;
	var dd;

	date = date.replace(/[^0-9]/g, "");
	cDate = addDay(date.substr(0, 4), date.substr(4, 2), date.substr(6, 2),  day)
	yyyy = cDate.getFullYear();
	mm = cDate.getMonth()+1;
	dd = cDate.getDate();
	mm = mm+"";
	dd = dd+"";

	if(mm.length ==1){
		mm = "0" + mm;
	}
	if(dd.length==1){
		dd = "0" + dd;
	}
	return yyyy+mm+dd;
}

/**
 * 날짜 합산
 * @param {int} 년도
 * @param {string} 월
 * @param {string} 일
 * @param {pDay}
 */
function addDay(yyyy, mm, dd, pDay){
	var oDate;
	dd = dd*1 + pDay*1;
	mm--;
	oDate = new Date(yyyy, mm, dd)
	return oDate;
}


/**
 * 날짜비교 (checkDay('','') !=true) )
 * @param {startDay idx}
 * @param {endDay idx}
 */
function checkDay(startDayIdx, endDayIdx,delimeter){

	var startDayObj = document.getElementById(startDayIdx);
	var endDayObj = document.getElementById(endDayIdx);
	if(startDayObj ==undefined && startDayObj ==null || endDayObj == undefined || endDayObj ==null){
        alert("날짜비교할 객제를 찾지 못했습니다. 형식을 올바르게 입력하세요");
        return false;
	}

    var defaultDelimeter = (delimeter ==undefined || delimeter ==null || trim(delimeter) =='') ? "/" : delimeter;


	var startDayObjVal = startDayObj.value.replaceAll(defaultDelimeter,"");
	var endDayObjVal = endDayObj.value.replaceAll(defaultDelimeter,"");

	if(trim(startDayObjVal) != '' && trim(endDayObjVal) == ''){
		alert('기간을 둘다 입력해야  합니다.');
		return false;
	}
	if(trim(startDayObjVal) == '' && trim(endDayObjVal) != ''){
		alert('기간을 둘다 입력해야  합니다.');
		return false;
	}
	if(trim(startDayObjVal) != '' && trim(endDayObjVal) != '' && endDayObjVal < startDayObjVal){
		alert('시작일자는 종료일자보다 이전으로 설정해 주세요.');
		return false;
	}
	return true;
}

/**
 * 체크박스 전체반전 (input type="checkbox" id="아이디" onclick="checkAll(this.id,'div.grid')")
 * @param {checkboxId 전체반전 체크박스 아이디}
 * @param {targetRange 대상 영역}
 */
function checkAll(checkboxId, val){
	if($("#"+checkboxId).is(':checked')){
		$(val + " input:checkbox").each(function(){
			if(!$(this).is(':checked')){
				$(this).attr('checked','checked');
			}
		});
	}else{
		$(val + " input:checkbox").each(function(){
			if($(this).is(':checked')){
				$(this).attr('checked',null);
			}
		});
	}
}



/**
 * 특수문자 아예 안먹게처리 :<br/>
 * 사용법 : <textarea onKeyPress="noSpecialChar(event)"></textarea>
 * @param {event} 이벤트
 */
function noSpecialChar(evt){
    var evCode = ( window.netscape ) ? evt.which : evt.keyCode ;
	var sChar = String.fromCharCode( evCode );

	if( sChar.match(/[^가-힣a-z0-9s]/gi)){
		if ( window.netscape ){
			evt.preventDefault() ;
		} else {
			event.cancelBubble = true;
			event.returnValue=false;
		}
	}
}

/**
 * 특수문자(.,-%~?*@#() 제외) 아예 안먹게처리 :<br/>
 * 사용법 : <textarea onKeyPress="noSpecialChar(event)"></textarea>
 * @param {event} 이벤트
 */
function noMemoSpecialChar(evt){
    var evCode = ( window.netscape ) ? evt.which : evt.keyCode ;
	var sChar = String.fromCharCode( evCode );

	if( !(sChar.match(/[^.,~?!*@#()가-힣a-z0-9s\-\%]/gi) ==null || sChar.match(/[^.,~?!*@#()가-힣a-z0-9s\-\%]/gi) ==" " || evCode==13) ){
		if ( window.netscape ){
			evt.preventDefault() ;
		} else {
			event.cancelBubble = true;
			event.returnValue=false;
		}
	}
}


/**
 * 백스페이스 클릭시 전체선택하게 처리:<br/>
 * 사용법 : <textarea onkeydown="backSpaceSelect(event)"></textarea>
 * @param {event} 이벤트
 */
function backSpaceSelect(evt){
    var evCode = ( window.netscape ) ? evt.which : evt.keyCode ;
	var obj = ( window.netscape ) ? evt.target : evt.srcElement ;
	if(evCode == 8){
        obj.select();
	}
}


/**
 * 컨트롤키 사용못하게 처리 <br/>
 * 사용법 : <textarea onkeydown="noCtrlKey(event)"></textarea>
 * @param {event} 이벤트
 */
function noCtrlKey(evt){
    var evt = (window.event) ? window.event: evt;
    if(evt.ctrlKey == true) {
		if ( window.netscape ){
			evt.preventDefault() ;
		} else {
		    event.cancelBubble = true;
			event.returnValue=false;
		}
    }
}



/**
 * (.)을 제외한 특수문자 안먹게
 * 사용법 : <textarea onKeyPress="noSpecialChar(event)"></textarea>
 * @param {event} 이벤트
 */
function noSpecialCharIncludeDot(evt){
    var evCode = ( window.netscape ) ? evt.which : event.keyCode ;
    var sChar = String.fromCharCode( evCode);
    if( sChar.match( /[^.가-힣a-z0-9s]/gi ) ){
        if ( window.netscape ){
            evt.preventDefault() ;
        } else {
            event.cancelBubble = true;
            event.returnValue=false;
        }
    }
}









/**
 * confirmMessageBox 단순 버튼 2개 처리: 반드시 jquery.BlockUI.js파일이 있어야 한다.
 * 사용상 주의사항<br/>
 * ※ confirm 함수처럼 pause가 되지 않으므로 잠시 로직을 멈출경우에는 다음과 같이 처리한다.<br />
 * <pre><code>
 *	if(eqlLeague != true && '전체' != leagueName) {
 *        splashConfirm('jQuery의 wrapId나 class형식','처리하시겠습니까/',function(_confirm_){
 *            if(_confirm_=='yes'){
 *    			처리할함수();
 *            }
 *        });
 *        return;
 *    }
 *    처리할함수();
 * </code></pre>
 * @see jquery.BlockUI.js
 * @param {string} mesgStr 메세지
 * @param {string} callbackFunc 콜백함수 : 파라미터 값으로 yes 혹은 no를 반환한다.
 */
function splashConfirm(idx,mesgStr, callbackFunc ,c,o,s){
    var colorStr = (c !=null && c !=undefined) ? c : 'transparent';
    var opacityStr = (o !=null && o !=undefined) ? o : '0.1';
    var sizeCls = (s !=null && s !=undefined) ? s : '387';

	$(idx).unblock();
	var returnVal = "";
	var confirmMesg = "<div class='splash splash"+sizeCls+"'><div>"+mesgStr+"<br/><p>"
				  + "<img id='____confirm_yes____' src='"+DOC.ROOT+"resources/img/t02_confirm.gif' alt='확인' class='cursorp' />"
				  + "<img id='____confirm_no____' src='"+DOC.ROOT+"resources/img/t02_cancel.gif' alt='취소' style='margin-left:2px' class='cursorp' />"
				  + "</p></div></div>";
	$(idx).block({message:confirmMesg,css:{ border:'0'},overlayCSS:{backgroundColor:colorStr,opacity:opacityStr}});
	$('#____confirm_yes____').click(function() {
		$(idx).unblock();
		callbackFunc('yes');
	});
	$('#____confirm_no____').click(function() {
		$(idx).unblock();
		callbackFunc('no');
	});
	return;
}




/**
 * alertMessageBox
 * 반드시 jquery.BlockUI.js파일이 있어야 한다.
 * @see jquery.BlockUI.js
 * @param {string} mesgStr 메세지
 * @author 김동완
 */
function splashAlert(idx,mesgStr,callbackFunc,c,o,s){
    var colorStr = (c !=null && c !=undefined) ? c : 'transparent';
    var opacityStr = (o !=null && o !=undefined) ? o : '0.1';
    var sizeCls = (s !=null && s !=undefined) ? s : '280';

	$(idx).unblock();
	var alertMesg = "<div class='splash splash"+sizeCls+"'><div>"+mesgStr+"<br /><p>"
				  + "<img id='____alert_yes____' src='"+DOC.ROOT+"resources/img/t02_confirm.gif' alt='확인' class='cursorp' />"
				  + "</p></div></div>";
	$(idx).block({message:alertMesg,css:{ border:'0'},overlayCSS:{backgroundColor:colorStr,opacity:opacityStr}});
	$('#____alert_yes____').click(function() {
		$(idx).unblock();
		if(callbackFunc !=undefined && callbackFunc !=null) callbackFunc();
	});
	return;
}





/**
 * loading Indicator
 * 반드시 jquery.BlockUI.js파일이 있어야 한다.
 * @see jquery.BlockUI.js
 * @param {string} mesgStr 메세지
 * @author 김동완
 */
function splashIndicator(idx,sc,mesgStr,c,o){
    $(idx).unblock();
    if(sc !=undefined && sc !=null && sc=="show" && mesgStr !=undefined && mesgStr !=null && mesgStr !="") {
        var colorStr = (c !=null && c !=undefined) ? c : '#FFF';
        var opacityStr = (o !=null && o !=undefined) ? o : '1';

    	var loadingMesg = "<div class='splash splash280 splaceIndicator'><div><ul><li class='indil'><img src='"+DOC.ROOT+"/resources/img/loading01.gif' alt='로딩중입니다.' /></li><li>"+mesgStr+"<br />"
    				  + "</li></ul></div></div>";
    	$(idx).block({message:loadingMesg,css:{ border:'0'},overlayCSS:{backgroundColor:colorStr,opacity:opacityStr}});
    }
	return;
}




/**
 * 스크롤바를 해당 객체의 위치에 둔다.<br />
 * 게임구매의 각 게임메인이나 오른쪽 TOP 아이콘 클릭시 사용한다.
 * @param {int} str 정수형으로 쓸 경우 해당 pixel에 스크롤바 위치, 객체Id를 쓸경우 해당 객체 Id에 위치
 */
function goScrollPosition(str,targetObj){
	var strPos = 0;
	if(isNaN(str)){
		if(document.getElementById(trim(str)) !=null && document.getElementById(trim(str)) !=undefined){
			var posCollection = getBounds(trim(str));
			strPos = posCollection.top;
		}
	}else{
		strPos = str;
	}

	if(targetObj != undefined && targetObj !=null && document.getElementById(targetObj) != undefined && document.getElementById(targetObj) !=null){
		document.getElementById(targetObj).scrollTop = strPos;
	}else {
		document.documentElement.scrollTop=strPos;
	}
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
 * HTML URL Requet 객체관련 클래스 인스턴스생성
 * @class HTML URL Requet 클래스
 * @constructor
 * @throws
 * @author 김동완
 * @since 2008.09.19
 */
var URLRequest = function(parentStr) {
	/** 파라미터명 */
	this.paramNames  = new Array();

	/** 파라미터값*/
	this.paramValues = new Array();

	/** 파라미터 개수*/
	this.paramLength = 0;

	/** 팝업여부*/
	this.popYN = true;

	/** parent 여부 */
	this.parentStr = parentStr;

	this.initialize(parentStr);

}

// HTML URL Request 메소드
URLRequest.prototype = {
    /**
     * 클래스 실행
     */
	initialize : function() {
		this.setRequestParameter(this.parentStr);
	},

    /**
     * 파라미터 분해
     */
	setRequestParameter : function(parentStr) {

		var sSearch = (parentStr !=null && parentStr !="" && parentStr =="parent" && parent != undefined && parent !=null ) ? unescape(parent.location.search) : unescape(window.location.search);
		if ( !opener ) this.popYN = false;
		if ( sSearch.length > 0 ) {
			var tParams = sSearch.substring(1).split("&");
			for ( var i=0; i < tParams.length; i++ ) {
				var tParamNameValue = tParams[i].split("=");
				tParamNameValue[0] != "" ? this.paramNames.push(tParamNameValue[0]) : this.paramNames.push("");
				tParamNameValue[1] != "" ? this.paramValues.push(tParamNameValue[1]) : this.paramValues.push("");
			}

			this.paramLength = this.paramNames.length;
		}
	},

    /**
     * 파라미터값 반환
     * @param {string} pParamName 파라미터명
     */
	getRequestParameter : function(pParamName) {

		for ( var i=0; i < this.paramLength; i++ ) {
			if ( this.paramNames[i] == pParamName ) {
				return this.paramValues[i];
			}
		}
		return null;
	},

	/**
	 * index로 파라미터값 반환
	 * @param {int} idx
	 */
	getRequestParameterValue : function(idx) {
		for ( var i=0; i < this.paramLength; i++ ) {
			if ( i == idx ) return this.paramValues[i];
		}
	},

	/**
	 * index로 파라미터명 반환
	 * @param {int} idx
	 */
	getRequestParameterName : function(idx) {
	for ( var i=0; i < this.paramLength; i++ ) {
		if ( i == idx ) return this.paramNames[i];
		}
	},

	/**
	 * index로 파라미터명으로 파라미터값 반환
	 * @param {string} pName
	 */
	getRequestParameterValueByName : function(pName) {
		for ( var i=0; i < this.paramLength; i++ ) {
			if ( this.getRequestParameterName(i) == pName ) return this.getRequestParameterValue(i);
		}
	},

	/**
	 * 파라미터 개수 반환
	 */
	getRequestParameterLength : function() {
		return this.paramLength;
	},

    /**
     * 파라미터 앞의 내용반환<br />
     * <ul>
     * <li>href - URL을 지정하여 지정한 페이지로 이동하거나 페이지의 URL 전체 정보를 반환한다.</li>
     * <li>protocol - ':'를 포함하는 http 나 ftp 등의 프로토콜 정보를 반환한다. </li>
     * <li>hostname - 호스트 이름과 포트 번호를 반환한다 </li>
     * <li>pathname - URL에서 경로부분의 정보를 반환한다</li>
     * <li>port - 포트번호를 반환한다.</li>
     * <li>search - '?'이후의 문자열을 반환한다.</li>
     * <li>hash - 지정한 앵커를 설정한 곳으로 이동하거나 앵커이름을 반환한다. </li>
     * </ul>
     * @return {string} 실제 원본 URI
     */
    getLocationURI :  function(){
        if(this.parentStr !=null && this.parentStr !="" && this.parentStr =="parent" && parent != undefined && parent !=null ) {
            return parent.location.href.replace(parent.location.search,"");
        }else {
            return window.location.href.replace(window.location.search,"");
        }
    },

    /**
     * 도메인을 제외한 모든 내용을 반환<br />
     * @return {string} 실제 원본 URI
     */
    getLocationURIExceptDomain :  function(){
        if(this.parentStr !=null && this.parentStr !="" && this.parentStr =="parent" && parent != undefined && parent !=null ) {
            return parent.location.pathname + parent.location.search + parent.location.hash;
        }else {
            return window.location.pathname + window.location.search + window.location.hash;
        }
    },

    /**
     * 도메인정보를 가져온다.<br />
     * @return {string} 실제 원본 URI
     */
    getLocationURIDomain :  function(){
        if(this.parentStr !=null && this.parentStr !="" && this.parentStr =="parent" && parent != undefined && parent !=null ) {
            return parent.location.href.replace(this.getLocationURIExceptDomain(),"");
        }else {
            return window.location.href.replace(this.getLocationURIExceptDomain(),"");
        }
    },


    /**
     * URL내의 해당 파라미터값을 바꿔 주소이동한다.
     * 없을 경우에는 추가하며 있을 경우 해당값을 변경시킨다.
     * @param {string} paramName 파라미터명
     * @param {string} paramValue 파라미터값
     */
    handleURLByParamName : function (paramName, paramValue){
        var currentURL = this.getLocationURIExceptDomain();

        var paramLength = this.getRequestParameterLength();
        if(paramLength ==0 ) {
            return currentURL + "?"+paramName + "=" + paramValue;
        } else {
            var existParamValue = this.getRequestParameterValueByName(paramName);
            if(existParamValue==paramValue){
                return currentURL;
            }else {
                var rtnVal = "";
                for(var i=0,len=paramLength; i < len; i++){
                    var paramNm = this.getRequestParameterName(i);
                    var paramVal = this.getRequestParameterValue(i);
                    if(paramName != paramNm){
                        var delimeter = (i==0) ? "?" : "&";
                        rtnVal = rtnVal + delimeter + paramNm + "=" + paramVal;
                    }
                }
                var delimeter = (paramLength ==1) ? "?" : "&";
                return this.getLocationURIExceptDomain() + delimeter + paramName +"="+ paramValue;
            }
        }
    },

	//팝업여부 반환
	getPopYN : function() {
		return this.popYN;
	}
}



/**
 * 금액마다 콤마를 찍어준다.
 * <code>onkeypress = addComma(this);</code>
 * @author 김동완
 */
function addComma(fname) {
	var value1 = delCommaRet(fname.value);
	var value2 = value1.length;
	var sVal = "";
	var j = 0;
	for (var i=value2; i>=0; i--) {
		var tmp = value1.charAt(i);
		if (tmp != ",") {
			if (j%3 == 0 && j != 0) {
				sVal = tmp + "," + sVal;
				j++;
			}else {
				sVal = tmp + sVal;
				j++;
			}
		}
	}
	fname.value = sVal;
}

/**
 * 금액마다 콤마를 찍어주고 값 리턴
 * <code>onkeyup="this.value=addCommaRet(this.value);"</code>
 * @author 김동완
 */
function addCommaRet(fname) {
	var value1 = delCommaRet(fname);
	var value2 = value1.length;
	var sVal = "";
	var j = 0;

	for (var i=value2-1; i>=0; i--) {
		var tmp = value1.charAt(i);
		if (tmp != ",") {
			if (j%3 == 0 && j != 0) {
				sVal = tmp + "," + sVal;
				j++;
			}else {
				sVal = tmp + sVal;
				j++;
			}
		}
	}
	return sVal;
}



/**
 * 콤마지우기
 * @author 김동완
 */
function delComma(fname) {
	var value1 = fname.value;
	var value2 = value1.length;
	var sVal = "";
	var j = 0;
	for (var i=value2; i>=0; i--) {
		var tmp = value1.charAt(i);
		if (tmp != ",") {
			sVal = tmp + sVal;
		}
	}
	fname.value = sVal;
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
 * 최초 로딩시 페이지 초기 설정
*/
function initializeHtmlPage(){

    for ( var i = 0 ; i < document.forms.length ; i++){
    	if(document.forms[i].autocomplete == undefined) document.forms[i].autocomplete = "off";
        document.forms[i].initialize = initializeHtmlForm;
        document.forms[i].initialize();
    }
}




/**
 *  특정폼을 Initalize 시키는 함수
 */
function formInitalizer(frm) {
    frm.initialize = initializeHtmlForm;
    frm.initialize();
}




/**********************
* <pre>
* 조회기간 체크
* <br> ex : validateSearchPeriodDate("20060613","20060714",3)
* </pre>
* @param : 조회 시작일(yyyymmdd)
* @param : 기준 일(yyyymmdd)
* @param : 조회 기간(int)
* @return : boolean
* @see
************************/
function validateSearchPeriodDate(startDate, nowDate , period)
{
    if(startDate.length > 8)
    {
        alet("조회일이 잘못되었습니다. ");
        return false;
    }

    var startYY =  parseInt(startDate.substring(0,4),10);
    var endYY =  parseInt(nowDate.substring(0,4),10);
    var startMM =  parseInt(startDate.substring(4,6),10);
    var endMM =  parseInt(nowDate.substring(4,6),10);
    var startDD =  parseInt(startDate.substring(6),10);
    var endDD =  parseInt(nowDate.substring(6),10);
    var dd = endDD - startDD;

    var startToEnd = ( ( endYY - startYY ) * 12) + endMM - startMM;
    if( startToEnd > parseInt(period,10) )
    {
        alert("조회기간은 현재월 기준으로 \"+period+\"개월 이전까지만 조회 가능합니다. ");
        return false;
    } else if(startToEnd == parseInt(period,10)) {
        if(dd >= 0) {
            alert("조회기간은 현재월 기준으로 \"+period+\"개월 이전까지만 조회 가능합니다.");
            return false;
        }
    }

    return true;
}







/**
* 이벤트 체크
* Firefox와 IE간 호환을 위함
*/
function checkEvent(event) {
    if (!event) { /* IE일 경우 */
          event = window.event;
          event.target = event.srcElement;
          event.which = event.keyCode;
    }
    return event;
}



/* ----------------------------------- 페이지 initialize 관련 함수 시작 ------------------------------------------------ */




/**********************
* 호출된 폼마다 셋팅하기.
* initialize시 셋팅하는 정보 : 필수 요소(css),mask,letter type
* @param :
* @return :
* @see
************************/
function initializeHtmlForm()
{

    for (var i = 0 ; i < this.elements.length ; i++)
    {
        if (this.elements[i].nodeName.toString().toLowerCase() == "input")
        {
            /* mask가 있을경우 #은 값을 의미함. */
            if (this.elements[i].getAttribute("maskform") != null && this.elements[i].getAttribute("maskform") != undefined && this.elements[i].getAttribute("maskform") != "")
            {
                if(this.elements[i].getAttribute("maskform") != "usermask")
                    initSetMaskUp(this.elements[i]);/* mask 타입(ex : ####/##/## , ####-##-## , ######-####### , ###-##-##### , ...) */
            }

            /* 문자 타입이 있을경우 */
            if (this.elements[i].getAttribute("chartype") != null &&  this.elements[i].getAttribute("chartype")  != undefined)
            {
                initSetLetterType(this.elements[i]);/* 문자 셋(english,korean,english+number, number, floatmoney,int)타입 */
            }

            /* 속성이 있을경우 */
            if (this.elements[i].getAttribute("disables") != null &&   this.elements[i].getAttribute("disables")  != undefined)
            {
                initSetAttribute(this.elements[i]);
            }

            /* maxlength가 있을경우 */
            if (this.elements[i].getAttribute("maxlength") != null &&  this.elements[i].getAttribute("maxlength") !=  undefined )
            {
                initSetMaxLength(this.elements[i]);
            }

            /* maxByte가 있을경우 */
            if ( this.elements[i].getAttribute("maxbyte") != null &&  this.elements[i].getAttribute("maxbyte")  != undefined)
            {
                initSetMaxLength(this.elements[i]);
            }

            /* uppercase가  있을 경우 */
            if (this.elements[i].getAttribute("uppercase")  != undefined){
                    initSetUpperLower(this.elements[i])
            }

            /* lowercase가  있을 경우 */
            if (this.elements[i].getAttribute("lowercase")  != undefined){
                    initSetUpperLower(this.elements[i])
            }

            /* 입력 모드 설정이  있을 경우 */
            if (this.elements[i].getAttribute("imemode") != null && this.elements[i].getAttribute("imemode") != undefined){
                    initImeMode(this.elements[i])
            }

        }/* end if */
    }/* end for - elements */
}




/**********************

* ImeMode 설정.
* @param : elem
* @return : void
* @see
************************/
function initImeMode(elem) {
    if(elem.imemode == "kor") {
        elem.style.imeMode = "active";
    }else if(elem.imemode == "eng") {
        elem.style.imeMode = "inactive";
    }else{
        elem.style.imeMode = "auto";
    }
}


/**********************
* uppercase, lowercase 설정시 keyPress시 이벤트 발생.
* @param : elem
* @return : void
* @see
************************/
function initSetUpperLower(elem) {
    if(elem.onkeypress == undefined){
        elem.onkeypress = setUpperLowerCase;
    }
}




/**********************
* input 테그에 uppercase, lowercase 속성이 있을경우 발생
* @param :
* @return : void
* @see
************************/
function setUpperLowerCase(event) {
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    if( event.target.uppercase != undefined) {
        if(event.which >= 97 && event.which <= 122){
            event.target.value = (event.target.value).toUpperCase();
            event.returnValue=false;
        }
    }

    if( event.target.lowercase != undefined) {
        if(event.which >= 65 && event.which <= 90){
            event.target.value = (event.target.value+pKey).toLowerCase();
            event.returnValue=false;
        }
    }
}


/**********************
* maxLength, maxbyte 설정시 keyUp시 이벤트 발생.
* @param : elem
* @return : void
* @see
************************/
function initSetMaxLength(elem) {
    if((elem.maxLength != undefined && elem.maxLength > 0 && elem.maxLength != 2147483647) && elem.chartype != undefined &&
        (elem.chartype == "kor" || elem.chartype == "kornum" || elem.chartype == "koreng" || elem.chartype == "korengnum") ) {
        elem.maxLength = elem.maxLength +1;
    }

    if(elem.onkeyup == undefined){
        elem.onkeyup = setOverSetFocus;
    }
}




/**********************
* maxLength, maxbyte 설정시 최대값보다 더 들어왔을시 자동 포커스 이동.
*  ex : setOverSetFocus()
* @param :
* @return :
* @see
************************/
function setOverSetFocus() {
    /* this 개체가 속한  폼이름 가져오기 */
    var thisFrm = "";

    thisFrm = eval(this.parentNode);

    while("form" != thisFrm.nodeName.toString().toLowerCase()){
        thisFrm = eval(thisFrm.parentNode);
    }

    var nextFocus = this;
    /* 다음 포커스 타겟 가져오기. */
    for (var i = 0 ; i < thisFrm.elements.length ; i++){
        if (thisFrm.elements[i].nodeName.toString().toLowerCase() == "input"){
            /* 현재 this값이 선택된 elements이면 다음으로 이동될 포커스를 가져오기 위한 로직수행. */
            if(this == thisFrm.elements[i]){
                if(thisFrm.elements[i].getAttribute("nextfocus") != null && thisFrm.elements[i].getAttribute("nextfocus") != undefined && thisFrm[thisFrm.elements[i].getAttribute("nextfocus")] != undefined) {
                    /* nextfocus 속성이 있을경우 nextfocus값을 다음 포커스로 잡는다. */
                    nextFocus = thisFrm[thisFrm.elements[i].getAttribute("nextfocus")];
                    /* if(nextFocus.length != undefined) nextFocus = nextFocus[0];  nexttarget이 select일경우 option이 된다. */
                    break;
                }

                /* elements가 undefined 될때 까지 수행함. */
                while(thisFrm.elements[++i] != undefined){
                    /* 현재 elements의 부모중의 속성이 display = none이면 다음 포커스 타겟을 가져온다. */
                    var targetCursor = eval(thisFrm.elements[i].parentNode);
                    while("form" != targetCursor.nodeName.toString().toLowerCase())    {
                        if(targetCursor.parentNode.style.display == "none") break;
                        targetCursor = eval(targetCursor.parentNode);

                    }
                    if(targetCursor.parentNode.style.display == "none") continue;

                    /* elements타입이 input (text,radio,checkbox), textarea, select 일경우 다음 포커스 this저장. */
                    if(thisFrm.elements[i].nodeName.toString().toLowerCase() == "input" &&
                        (thisFrm.elements[i].type == "text" || thisFrm.elements[i].type == "password" ||
                            thisFrm.elements[i].type == "radio" || thisFrm.elements[i].type == "checkbox" ||
                                thisFrm.elements[i].nodeName.toString().toLowerCase() == "textarea" ||
                                    thisFrm.elements[i].nodeName.toString().toLowerCase() == "select" ))
                    {
                        nextFocus = thisFrm.elements[i];
                        break;
                    }
                }
            }
        }
    }

    if(this == nextFocus) return; //맨마지막일 경우 포커스 이동 정지


    /* 포커스 이동. maxLength 2147483647은 maxLength의 값을 주지 않았을경우 기본적으로 주는 최대값. */
    if(this.maxbyte != undefined && this.maxLength != 2147483647) {
    /* 1. maxbyte와 maxLength를 둘다 선택 하였을때.. */
        if((this.maxLength <= this.value.length) || (this.maxbyte < calculate_msglen(this.value)))
        {
            this.blur();
            if(nextFocus.nodeName.toString().toLowerCase() == "select") {
                nextFocus.focus();
            }else if(nextFocus.nodeName.toString().toLowerCase() == "input" && (nextFocus.type == "checkbox" || nextFocus.type == "radio")) {
                nextFocus.focus();
            }else {
                nextFocus.select();
            }
            this.value = cutStringToByte(this.value, this.maxbyte);

            var thisChartype = this.chartype;
            if(thisChartype != undefined &&
                (thisChartype == "kor" || thisChartype == "kornum" || thisChartype == "koreng" || thisChartype == "korengnum"))
                /* this.maxLength = this.maxLength-1; */
                this.value = this.value.substring(0, this.maxLength-1);
        }
    }else if(this.maxbyte == undefined && this.maxLength != 2147483647) {
    /* 2. maxLength만 설정했을때.. */
        if( (this.maxLength) <= this.value.length){
            this.blur();
            if(nextFocus.nodeName.toString().toLowerCase() == "select") {
                nextFocus.focus();
            }else if(nextFocus.nodeName.toString().toLowerCase() == "input" && (nextFocus.type == "checkbox" || nextFocus.type == "radio")) {
                nextFocus.focus();
            }else {
                this.blur();
                nextFocus.select();
            }

            var thisChartype = this.chartype;
            if(thisChartype != undefined &&
                (thisChartype == "kor" || thisChartype == "kornum" || thisChartype == "koreng" || thisChartype == "korengnum"))
                /* this.maxLength = this.maxLength-1; */
                this.value = this.value.substring(0, this.maxLength-1);
        }
    }else if(this.maxbyte != undefined && this.maxLength == 2147483647) {
    /* 3. maxByte만 설정했을때.. */
        if(this.maxbyte < calculate_msglen(this.value) )
        {
            this.blur();
            if(nextFocus.nodeName.toString().toLowerCase() == "select") {
                nextFocus.focus();
            }else if(nextFocus.nodeName.toString().toLowerCase() == "input" && (nextFocus.type == "checkbox" || nextFocus.type == "radio")) {
                nextFocus.focus();
            }else {
                nextFocus.select();
            }
        this.value = cutStringToByte(this.value, this.maxbyte);
        }
    }
}





/**********************
* 문자열을 Byte길이로 잘라옴.
*  ex : cutStringToByte(form1.name.value, bytelength)
* @param : 바이트 길이로 자를 문자열
* @return : 바이트 길이
* @see
************************/
function cutStringToByte(strValue,cutByte)
{
    var sumLength = 0;
    var resultStr = "";
    for(var i= 0;i < strValue.length; i++)
    {
        if( escape(strValue.charAt(i)).length > 3 ) { strLength = 2; }
            else if (strValue.charAt(i) == '<' || strValue.charAt(i) == '>') { strLength = 4; }
            else { strLength = 1 ; }
        if ( cutByte < (sumLength + strLength) ) { break; }
            sumLength += strLength;
            resultStr += strValue.charAt(i);
    }
    return resultStr;
}


/**********************
* 속성에 따른 input창 상태 셋팅.
*  ex : initSetAttribute(form1.name)
* @param : 이벤트를 셋팅할 element
* @return : void
* @see
************************/
function initSetAttribute(elem)
{
    if (elem.disables  == "true")
    {
        elem.disabled = true;
        /* elem.className = "frameworkDisabled"; */
        elem.style.backgroundColor = "#cccccc";
    }
}


/**********************
* 숫자열 마스크 씌우기
*  ex : initSetMaskUp(form1.name)
* @param : 마스크를 셋팅할 element
* @return : void
* @see
************************/
function initSetMaskUp(elem)
{
    elem.onkeypress = setKeyInputNumberOnly;
    if(elem.onfocus == undefined) elem.onfocus = filterGetNumberOnly;
    if(elem.onblur == undefined) elem.onblur = setInitMaskUp;
}

/**********************
* 주민 번호 onkeyup이벤트시 마스크 씌우기
*  ex : psnMaskup(form1.name)
* @param : 마스크를 셋팅할 element
* @return : void
* @see
************************/
function psnMaskup(elem)
{
    var data = getOnlyNumberFormat(elem.value);

    if(data.length <= 3)
    {
        return;
    }else if (data.length > 6 && data.length <= 13)
    {
        elem.value = data.substr(0,6) + "-" + data.substring(6);
    } else if(data.length > 13) {
        elem.value = data.substr(0,6) + "-" + data.substr(6,7);
    }
}

/**********************
* 사업자 번호 onkeyup이벤트시 마스크 씌우기
*  ex : psnMaskup(form1.name)
* @param : 마스크를 셋팅할 element
* @return : void
* @see
************************/
function crnMaskup(elem)
{
    var data = getOnlyNumberFormat(elem.value);

    if(data.length <= 3)
    {
        return;
    } else if(data.length > 3 && data.length <= 5)
    {
        elem.value = data.substr(0,3) + "-" + data.substring(3);
    }else if (data.length > 5 && data.length <= 10)
    {
        elem.value = data.substr(0,3) + "-" + data.substr(3,2) + "-" + data.substring(5);
    }else if(data.length > 10) {
        elem.value = data.substr(0,3) + "-" + data.substr(3,2) + "-" + data.substr(5,5);
    }
}

/**********************
* 주민 사업자 번호 onkeyup이벤트시 마스크 씌우기
*  ex : psnCrnMaskup(form1.name)
* @param : 마스크를 셋팅할 element
* @return : void
* @see
************************/
function psnCrnMaskup(elem)
{
    var data = getOnlyNumberFormat(elem.value);

    if(data.length <= 3)
    {
        return;
    }
    else if(data.length > 3 && data.length <= 5)
    {
        elem.value = data.substr(0,3) + "-" + data.substring(3);
    }else if (data.length > 5 && data.length <= 10)
    {
        elem.value = data.substr(0,3) + "-" + data.substr(3,2) + "-" + data.substring(5);
    } else if (data.length > 10 && data.length <= 13)
    {
        elem.value = data.substr(0,6) + "-" + data.substring(6);
    } else if(data.length > 13) {
        elem.value = data.substr(0,6) + "-" + data.substr(6,7);
    }
}


/**********************
* 페이지 초기화시에 onfocus 이벤트에 할당되면 이 Elemnent에 숫자외의 문자("," , "/" , "-")는 focus시에 제거됨
* @param :
* @return : void
* @see
************************/
function filterGetNumberOnly()
{
    this.value = getOnlyNumberFormat(this.value);
    this.select();
}



/**********************
* 문자열에서 숫자만 빼오기 체크 로직
* ex : getOnlyNumberFormat(form1.name.value)
* @param : 변환할 String 값
* @return : void
* @see
************************/
function getOnlyNumberFormat(sv)
{
    if(sv == null) return;
    var temp="";
    var ret = "";

    for(var index = 0 ; index < sv.length ; index++)
    {
        temp = parseInt(sv.charAt(index), 10);
        if( temp >= 0 || temp <= 9)
        {
            ret +=temp;
        }
    }
    return ret;

}

/**********************
* 문자열에서 숫자,'-','.' 만 빼오기 체크 로직
* ex : getOnlyNumberFormat(form1.name.value)
* @param : 변환할 String 값
* @return : void
* @see
************************/
function getOnlyFloatNumberFormat(sv)
{
    if(sv == null) return;
    var temp="";
    var ret = "";

    for(var index = 0 ; index < sv.length ; index++)
    {
        if(sv.charAt(index) == '-' || sv.charAt(index) == '.') {
            ret += sv.charAt(index);
            continue;
        }

        temp = parseInt(sv.charAt(index), 10);
        if( temp >= 0 || temp <= 9)
        {
            ret += temp;
        }
    }
    return ret;

}

/**********************
* 페이지 초기화시에 마스크 설정값대로 변환하기
* @param :
* @return : void
* @see
************************/
function setInitMaskUp()
{
    /* var mask = this.maskform; */
    var mask = document.getElementsByName(this.name)[0].getAttribute('maskform');

    if(this.value == "")
        return;

    var inputV = getOnlyNumberFormat(this.value);

    for ( var i = 0 ; i < mask.length ; i++)
    {
        if ( mask.substring(i,i+1) != "#" )
            inputV = inputV.substring(0,i) + mask.substring(i,i+1) + inputV.substring(i);
    }

    this.value = inputV;
}


/**********************
* 페이지 초기화시 숫자만 입력받기
* @param :
* @return : void
* @see
************************/
function setKeyInputNumberOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */

    if(event.shiftKey == true) event.returnValue = false;

    if (  (event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105 ))/* 숫자 키코드값 */
    {
        /*  enter, tab, backspace 방향키(앞,뒤)는 예외처리 */
        if(event.which == 8 || event.which == 9 || event.which == 37 || event.which == 39)
        {
            return true;
        }
        event.returnValue = false;
    }

    var pKey = String.fromCharCode(event.which);

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}



/**
 * 클립보드에서 데이터 가져올때 숫자만 붙여넣기 가능하도록 처리
 */
function setPasteNumberOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */

    var clipdata = window.clipboardData.getData("Text");
    clipdata = clipdata.replace(/-/gi,"");
    if(clipdata.match(/^\d+$/ig) == null){
        /* alert("형식이 맞지 않습니다."); */
        return false;
    }

    var element = document.all.tags('INPUT');

    for(var idx=0; idx < element.length; idx++){
        var obj = element[idx];
        if(obj.onpaste && obj == this){

            obj.value = clipdata.substring(0,clipdata.length);
        }
    }

    event.returnValue = false;
}

/**********************
* 페이지 초기화시에 언어 및 숫자형 입력 및 표현 처리.
* @param : 이벤트를 셋팅할 element
* @return : void
* @see
************************/
function initSetLetterType(elem)
{

    if (elem.getAttribute("chartype") == "kor")/* 한글만 */
    {
        elem.style.imeMode = "active";
        elem.onblur = setLetterKoreanOnlyBlur;
    } else if (elem.getAttribute("chartype") == "kornum")/* 한글+숫자 */
    {
        elem.style.imeMode = "active";
        elem.onblur = setLetterKorNumOnlyBlur;
    } else if (elem.getAttribute("chartype") == "koreng")/* 한글+영문 */
    {
        elem.style.imeMode = "auto";
        elem.onblur = setLetterKorEngOnlyBlur;
    } else if (elem.getAttribute("chartype") == "korengnum")/* 한글+영문+숫자 */
    {
        elem.style.imeMode = "auto";
        elem.onblur = setLetterKorEngNumOnlyBlur;
    } else if (elem.getAttribute("chartype")  == "eng")/* 영어만 */
    {
        elem.style.imeMode = "inactive";
        elem.onblur = setLetterEnglishOnlyBlur;
    } else if (elem.getAttribute("chartype")  == "engnum")/* 영어+숫자 */
    {
        elem.style.imeMode = "disabled";
        elem.onblur = setLetterEngNumOnlyBlur;
        /* 특수문자 입력 안되게 수정해야함. */
    } else if (elem.getAttribute("chartype")  == "float")/* 실수형 */
    {
        elem.onblur = setLetterFloatOnlyBlur;

    } else if (elem.getAttribute("chartype")  == "int")/* 정수형 */
    {
        elem.onblur = setLetterIntegerBlur;
    } else if (elem.getAttribute("chartype")  == "onlynum")/* 오직 숫자만 */
    {
        elem.onblur = setKeyInputNumberOnlyBlur;
        elem.onpaste = setPasteNumberOnly;
    } else if (elem.getAttribute("chartype")  == "money")/* 정수로만 된 아주 기본적인 금액 표시 */
    {
        elem.style.textAlign="right";
        elem.onblur = setMoneyBlur;
    } else if (elem.getAttribute("chartype") == "floatmoney")
    {
        elem.style.textAlign="right";
        elem.onblur = setFloatMoneyBlur; /*  setKeydownFloatMoney + setFloatMoney 처리 */
    }
}







/**********************
* 스트링값을 정수형 머니 형태로 변환
*  ex : changeIntMoneyType("1100000") 리턴되는 데이타 : 1,100,000
* @param : 변환할 String 데이타
* @return : 금액 형태로 변환된 스트링
* @see
************************/
function changeIntMoneyType(data)
{
    var tempV = data;

    var moneyReg = new RegExp('(-?[0-9]+)([0-9]{3})');
    tempV = tempV.replace(/\,/g, "");
    while(moneyReg.test(tempV))
    {
        tempV = tempV.replace(moneyReg, '$1,$2');
    }
    return tempV;
}


/**********************
* 실수형 금액 입력제어 스크립트. 숫자 , . , - 값만 입력받음. 소수점 두째 자리까지만 입력됨
*  ex : changeIntMoneyType("1100000") 리턴되는 데이타 : 1,100,000
* @param : 변환할 String 데이타
* @return : 금액 형태로 변환된 스트링
* @see
************************/
function setKeydownFloatMoney(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    if(event.shiftKey == true) event.returnValue = false;

    var floatindex = event.target.value.indexOf(".");

    if(floatindex != -1)
    {
        var floatNum = event.target.value.substring(floatindex+1);
        if (event.which == 8 )
            return;
        else if (floatNum.length > 1 )
            event.returnValue = false;
    }

    if ( event.which<48||(event.which>57&&event.which<96)||event.which>105 )/* 숫자 키코드값 */
    {
        if( event.which == 8 || event.which == 9 || event.which == 37 || event.which == 39 || event.which == 189)
        {
            return;
        } else if( event.which == 190 && floatindex == -1 )
        {
            return
        }

        event.returnValue = false;
    }
}


/**********************
* 키 입력시 float 타입의 금액 형태로 전환
* @param :
* @return :
* @see
************************/
function setFloatMoney(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var ev = event.target;
    var pKey = String.fromCharCode(event.which);

    var tempV = ev.value;
    var floatnum = "";

    if(tempV.indexOf(".") != -1)
    {
        floatnum = tempV.substring(tempV.indexOf(".")) + pKey;
        tempV = tempV.substring(0,tempV.indexOf("."));
    } else {
        tempV = tempV + pKey;
    }

    var moneyReg = new RegExp('(-?[0-9]+)([0-9]{3})');
    tempV = tempV.replace(/\,/g, "");
    while(moneyReg.test(tempV))
    {
        tempV = tempV.replace(moneyReg, '$1,$2');
    }

    ev.value = tempV+floatnum;
    if(event.which == 9){ev.select();}
    event.returnValue=false;
}

/**********************
* 키 입력시 한글만 입력받기
* @param :
* @return :
* @see
************************/
function setLetterKoreanOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    if(!((pKey.charCodeAt() > 0x3130 && pKey.charCodeAt() < 0x318F) || (pKey.charCodeAt() >= 0xAC00 && pKey.charCodeAt() <= 0xD7A3)))
    {
        event.returnValue=false;
        delete eReg;
    }

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}

/**********************
* 키 입력시 한글,숫자 입력받기
* @param :
* @return :
* @see
************************/
function setLetterKorNumOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    if(!((pKey.charCodeAt() > 0x3130 && pKey.charCodeAt() < 0x318F) || (pKey.charCodeAt() >= 0xAC00 && pKey.charCodeAt() <= 0xD7A3)
    || !setKeyInputNumberOnly(event)))
    {
        event.returnValue=false;
        delete eReg;
    }

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}


/**********************
* 키 입력시 한글,영어만 입력받기
* @param :
* @return :
* @see
************************/
function setLetterKorEngOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    var eReg = /[a-zA-Z]/g;
    if(!((pKey.charCodeAt() > 0x3130 && pKey.charCodeAt() < 0x318F) || (pKey.charCodeAt() >= 0xAC00 && pKey.charCodeAt() <= 0xD7A3)
        || !(pKey!="\r" && !eReg.test(pKey))))
    {
        event.returnValue=false;
        delete eReg;
    }

    setUpperLowerCase();

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}


/**********************
* 키 입력시 한글,영어,숫자만 입력받기
* @param :
* @return :
* @see
************************/
function setLetterKorEngNumOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    var eReg = /[a-zA-Z]/g;
    if(!((pKey.charCodeAt() > 0x3130 && pKey.charCodeAt() < 0x318F) || (pKey.charCodeAt() >= 0xAC00 && pKey.charCodeAt() <= 0xD7A3)
        || !(pKey!="\r" && !eReg.test(pKey))  || !setKeyInputNumberOnly(event)))
    {
        event.returnValue=false;
        delete eReg;
    }
    setUpperLowerCase();

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}


/**********************
* 키 입력시 영어만 입력받기
* @param :
* @return :
* @see
************************/
function setLetterEnglishOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    var eReg = /[a-zA-Z]/g;

    if(pKey!="\r" && !eReg.test(pKey)) /* 엔터키 및 regkey가 아닐경우 리턴 */
        event.returnValue=false;

    delete eReg;

    setUpperLowerCase();

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}

/**********************
* 키 입력시 숫자,- 값만 입력받음.
* @param :
* @return :
* @see
************************/
function setLetterInteger(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    var intReg = /[0-9\\-]/g;

    if(pKey!="\r" && !intReg.test(pKey)) /* 엔터키 및 regkey가 아닐경우 리턴 */
        event.returnValue=false;

    delete intReg;

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}



/**********************
* 키 입력시 숫자 , . , - 값만 입력받음.
* @param :
* @return :
* @see
************************/
function setLetterFloatOnly(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var pKey = String.fromCharCode(event.which);
    var floatReg = /[0-9\\.\\-]/g;

    if(pKey!="\r" && !floatReg.test(pKey)) /* 엔터키 및 regkey가 아닐경우 리턴 */
        event.returnValue=false;

    delete floatReg;

    if( event.target.getAttribute("userchar") != undefined) {
        var userKey = event.target.getAttribute("userchar");
        for(i=0;i< userKey.length;i++) {
            if(pKey == userKey.charAt(i)) {
                event.returnValue=true;
                break;
            }
        }
    }
}




function setKeyInputNumberOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;

    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);

            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if( !( (userChar == true && userCharYn) || (pKey > 47 && pKey < 58) || (pKey == 8 || pKey == 9 ) ) ) {
                alert("숫자만 입력할 수 있습니다.");
                el.value = "";
                el.focus();
                return false;
            }
            userChar = false;
        }
}

/**********************
*  키 입력시 한글,영어,숫자만 입력받기 (onBlur 버전)
* @param :
* @return :
* @see
************************/
function setLetterKorEngNumOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);
            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if( !((userChar == true && userCharYn) || (pKey > 0x3130 && pKey < 0x318F) || ((pKey >= 0xAC00 && pKey <= 0xD7A3))) &&
                !((pKey > 96 && pKey < 123) || (pKey > 64 && pKey < 91)) && !(pKey > 47 && pKey < 58) ) {
                return false;
            }
            userChar = false;
    }
}

/**********************
*  키 입력시 한글만 입력받기 (onBlur 버젼)
* @param :
* @return :
* @see
************************/
function setLetterKoreanOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);

            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if((!((userChar == true && userCharYn) || (pKey > 0x3130 && pKey < 0x318F) || (pKey >= 0xAC00 && pKey <= 0xD7A3))) )
            {
                return false;
            }
            userChar = false;
    }
}


/**********************
*  키 입력시 한글,숫자 입력받기 (onBlur 버젼)
* @param :
* @return :
* @see
************************/
function setLetterKorNumOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);

            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if(( !((userChar == true && userCharYn) || (pKey > 0x3130 && pKey < 0x318F) || (pKey >= 0xAC00 && pKey <= 0xD7A3)) && (pKey < 48 || pKey > 57)) )
            {
                /*  enter, tab, backspace 방향키(앞,뒤)는 예외처리 */
                if(pKey == 8 || pKey == 9 ){
                    continue;
                } else {
                    return false;
                }
            }
            userChar = false;
        }
}



/**********************
*  키 입력시 한글,영어만 입력받기 (onBlur 버전)
* @param :
* @return :
* @see
************************/
function setLetterKorEngOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);
            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if((!((userChar == true && userCharYn) || (pKey > 0x3130 && pKey < 0x318F) || ((pKey >= 0xAC00 && pKey <= 0xD7A3))) &&
                !((pKey > 96 && pKey < 123) || (pKey > 64 && pKey < 91)))) {
                return false;
            }
            userChar = false;
    }
}


/**********************
*  키 입력시 영어만 입력받기 (onBlur 버전)
* @param :
* @return :
* @see
************************/
function setLetterEnglishOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);
            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if((!((userChar == true && userCharYn) || (pKey > 96 && pKey < 123) || (pKey > 64 && pKey < 91)))) {
                return false;
            }
            userChar = false;
    }
}

/**********************
*  키 입력시 영어,숫자만 입력받기 (onBlur 버전)
* @param :
* @return :
* @see
************************/
function setLetterEngNumOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var userChar = false;
    var userKey  = "";
    var userCharYn = false;
    for(i=0;i < event.target.value.length;i++) {
        var pKey = event.target.value.charCodeAt(i);
            if( event.target.getAttribute("userchar") != undefined) {
            userCharYn = true;
            userKey = event.target.getAttribute("userchar");
                for(x=0;x< userKey.length;x++) {
                    if(pKey == userKey.charCodeAt(x)) {
                        userChar = true;
                        break;
                    }
                }
            }

            if((!((userChar == true && userCharYn) || (pKey > 96 && pKey < 123) || (pKey > 64 && pKey < 91)) && !(pKey > 47 && pKey < 58))) {
            	alert("영문과 숫자만 입력할 수 있습니다.");
                el.value = "";
                el.focus();
                return false;
            }

            userChar = false;
        }
}


/**********************
*  키 입력시 숫자,- 값만 입력받음. (onBlur버전)
* @param :
* @return :
* @see
************************/
function setLetterIntegerBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */
    var evtValueLength = event.target.value.length;

    for(i=0;i < evtValueLength;i++) {
        var pKey = event.target.value.charCodeAt(i);

        /* - 만 입력됐을 경우 */
        if(evtValueLength == 1 && pKey == 45) {
            return false;
        }

        if(((evtValueLength-1)-i)%4 == 3 && (evtValueLength-1) != 0 && event.target.value.charAt(i) == ',' ) continue;
        if(i == 0 && event.target.value.charAt(i) == '-' ) continue;

        /*  입력값중 '-' 가 중간에 존재할경우 경고 메시지 */
        if(i != 0 && pKey == 45) {
            return false;
        }

        if(!(pKey > 47 && pKey < 58) && !(pKey == 45)) {
            return false;
        }
    }
}

/**********************
*  키 입력시 숫자 , . , - 값만 입력받음. (onBlur 버전)
* @param :
* @return :
* @see
************************/
function setLetterFloatOnlyBlur(event)
{
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;      /* 이벤트가 발생하는 대상 */
    var floatPoint = event.target.value.indexOf('.') != -1 ? event.target.value.indexOf('.'):event.target.value.length;
    var evtValueLength = event.target.value.length;
    for(i=0;i < evtValueLength;i++) {
        var pKey = event.target.value.charCodeAt(i);

        /* - 만 입력됐을 경우 */
        if(evtValueLength == 1 && pKey == 45) {
            return false;
        }

        /* 입력값중 '.' 가 맨 앞이나 맨 뒤에  존재할경우 경고 메시지 */
        if(i == 0 && pKey == 46 || i == (evtValueLength-1) && pKey == 46) {
            return false;
        }

        /* 소수점 이상의 수일경우 */
        if(i<floatPoint) {
            if(((floatPoint-1)-i)%4 == 3 && (floatPoint-1) != 0 && event.target.value.charAt(i) == ',' ) continue;
            if(i == 0 && event.target.value.charAt(i) == '-' ) continue;
        }

        if(i> floatPoint && event.target.value.charAt(i) == '.') {
            return false;
        }

        /*  입력값중 '-' 가 중간에 존재할경우 경고 메시지 */
        if(i != 0 && pKey == 45) {
            return false;
        }

        if(!(pKey > 47 && pKey < 58) && !(pKey == 45 || pKey == 46)) {
            return false;
        }
    }
}

/**********************
*  chartype="money"처리. 숫자만 입력, 3자리마다 "," 처리. (onBlur 버전)
*  '-',숫자만 입력
* @param :
* @return :
* @see
************************/
function setMoneyBlur(event) {
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */
    var tempV  = event.target.value;

    if(tempV.length > 0){
        var stat = true;
        while(stat)
        {
            if((tempV.length > 0 && tempV.substring(0,1)==0))
            {
                tempV = tempV.substr(1);
            }else if(tempV.length > 1 && tempV.substring(0,1)== '-' && tempV.substring(1,2)== 0) {
                tempV = "-" + tempV.substr(2);
            }else {
                stat = false;
            }
        }
    }

    var moneyReg = new RegExp('(-?[0-9]+)([0-9]{3})');
    tempV = tempV.replace(/\,/g, "");
    while(moneyReg.test(tempV))
    {
        tempV = tempV.replace(moneyReg, '$1,$2');
    }

    event.target.value = tempV;
    setLetterIntegerBlur(event);
    /* if(event.which == 9){event.target.select();} */
    event.returnValue=false;

}

/**********************
*  chartype="floatmoney"처리. ".",숫자만 입력, 3자리마다 ","처리. setKeydownFloatMoney + setFloatMoney (onBlur 버전)
* '-','.',숫자만 입력
* @param :
* @return :
* @see
************************/
function setFloatMoneyBlur(event) {
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var el = event.target;  /* 이벤트가 발생하는 대상 */

    var tempV = event.target.value;

    var floatnum = "";

    if(tempV.indexOf(".") != -1)
    {
        floatnum = tempV.substring(tempV.indexOf("."));
        tempV = tempV.substring(0,tempV.indexOf("."));
    }

    /* 처음 값이 0이고 다음 값이 .이 아닐경우 */
    if(tempV.charAt(0) == "0" && floatnum == "") {
        while(tempV.charAt(0) == "0"){
            tempV = tempV.substring(1);
        }
    }

    /* 처음 값이 - 이고 두번째 값이 0 일때 세번째 값이 .가 아닐경우 */
    if(tempV.charAt(0) == "-" && tempV.charAt(1) == "0" && floatnum == "") {
        while(tempV.charAt(1) == "0"){
            tempV = "-"+tempV.substring(2);
        }
    }

    /* 소수점 앞에 값이 숫자가 아닐경우 */
    if(isNaN(tempV.charAt(tempV.length-1))) {
        while(isNaN(tempV.charAt(tempV.length-1)) && tempV.length > 0) {
            tempV = tempV.substring(0,(tempV.length >=1 ? tempV.length-1:0));
        }
        floatnum = floatnum.substring(1);
    }

    var moneyReg = new RegExp('(-?[0-9]+)([0-9]{3})');
    tempV = tempV.replace(/\,/g, "");
    floatnum = floatnum.replace(/\,/g, "");
    while(moneyReg.test(tempV))
    {
        tempV = tempV.replace(moneyReg, '$1,$2');
    }

    event.target.value = tempV+floatnum;
    setLetterFloatOnlyBlur(event);
    event.returnValue=false;
}







/**********************
*  최소값 체크 로직
*  ex : validationMinimum("100000","10000")
* @param : 지정된 최소 value
* @param : 입력된 Value
* @return : boolean
* @see
************************/
function validationMinimum(minV,inV)
{
    if (minV == "")
    {
        alert(validationMinimum_str);
        return false;
    }

    if ( parseFloat(inV) < parseFloat(minV) )
    {
        return false;
    }

    return true;
}


/**********************
*  최대값 체크 로직
*  ex : validationMaximum("100000","10000")
* @param : 지정된 최대 value
* @param : 입력된 Value
* @return : boolean
* @see
************************/

function validationMaximum(maxV,inV)
{
    if (maxV == "")
    {
        alert(validationMaximum_str);
        return false;
    }


    if ( parseFloat(maxV) < parseFloat(inV) )
    {
        return false;
    }
    return true;
}


/**********************
*  최대 btye 체크 로직
*  ex : validationMaxByte(form1.inputname.value , 10)
* @param : 체크할 String value
* @param : 최대 byte
* @return : boolean
* @see
************************/
function validationMaxByte(textObj, length_limit)
{
    var length = calculate_msglen(textObj);
    var kor_cnt = Math.floor(length_limit/2);
    if (length > length_limit) {
        return false;
    }
    return true;
}


/**********************
*  최소 btye 체크 로직
*  ex : validationMaxByte(form1.inputname.value , 10)
* @param : 체크할 String value
* @param : 최소 byte
* @return : boolean
* @see
************************/
function validationMinByte(textObj, length_limit)
{
    var length = calculate_msglen(textObj);
    var kor_cnt = Math.floor(length_limit/2);
    if (length < length_limit) {
        return false;
    }
    return true;
}

/*********************
*  한글 2글자 영문 1글자로 길이 측정하여 문자열의 byte 길이를 리턴한다.
*  ex : validationMaxByte(form1.inputname.value , 10)
* @param : 체크할 String value
* @return : 측정한 해당 값의 byte 길이
* @see
************************/
function calculate_msglen(message)
{
    var nbytes = 0;

    for (i=0; i<message.length; i++) {
        var ch = message.charAt(i);
        if(escape(ch).length > 4) {
            nbytes += 2;
        } else if (ch == '\n') {
            if (message.charAt(i-1) != '\r') {
                nbytes += 1;
            }
        } else if (ch == '<' || ch == '>') {
            nbytes += 4;
        } else {
            nbytes += 1;
        }
    }
    return nbytes;
}


/**********************
*  get,put 만 되는 hash table
*  ex : var temphash = new javascriptHashtable()
*  ex : temphash.put("key1","토요일"); 값 넣기
*  ex : temphash.put("key2","일요일");
*  ex : temphash.get("key1"); 값 가져오기
* @param :
* @return :
* @see
************************/
function javascriptHashtable(){
    this.hash = new Array();
}

javascriptHashtable.prototype.get = function (key)
{
    if(this.hash[key] == undefined)
        return "null";
    else
        return this.hash[key];
};
javascriptHashtable.prototype.put = function (key, value)
{
    if (key == null || value == null)
        return i18nExtAlert("key and value do not permit null or blank");

    if (this.hash[key] != null)
        return i18nExtAlert("already exist value");

    this.hash[key] = value;
};


/**********************
*  중첩된 css에서 해당 css만 제거
*  ex : removeCss(["input1","input2"],"input1")
* @param : 설정되어 있는 class 배열. (참고로 css는 class="input1 input2" 이런식으로 중복될수 있다.
* @param : 제거할 css명
* @return : 제거할 css가 제거된 스트링값
* @see
************************/
function removeCss(cssArr,reAtt)
{
    var retCss="";
    for( var i = 0 ; i < cssArr.length ; i++)
    {
        if(reAtt != cssArr[i] )
            retCss += cssArr[i] + " ";
    }

    return retCss;
}

/**********************
* submit 상태를 알려주는 submitstat 값을 false로 바꿔주는 함수.
* @param :
* @return :
* @see
************************/
function submitStateFalse(frm) {
    frm.submitstat = "false";
}

/**********************
* MaskUp된 데이타에서 마스크 Delemeter 제외하고 값 리턴
*  ex : unMaskUpData(form1.name)
* @param : 마스크한 요소 name 또는 해당 객체 자체.
* @return : 구분자를 제외한 데이타값
* @see
************************/
function unMaskUpData(element)
{
    var unmaskData = "";
    /* mask한 값에서 마스크 값 삭제 */
    if ( ( element.maskform != undefined && element.maskform != "") || element.chartype  == "money")
    {
        unmaskData = getOnlyNumberFormat(element.value);
    } else unmaskData = element.value;

    return unmaskData;
}



/**********************
* 사용자가 지정한 마스크업 스타일중 영어,숫자 혼합인 데이타의 mask를 지울때 사용 영어,숫자 이외의 문자 제거
*  ex : unMaskEngNum(String)
* @param : 마스크가 있는 String
* @return : 구분자를 제외한 String
* @see
************************/
function unMaskEngNum(data) {

    var accReg = new RegExp('([a-zA-Z0-9])');

    var temp = "";
    for(var i = 0 ; i < data.length ; i++)
    {
        if(accReg.test(data.substr(i,1)))
        {
            temp += data.substr(i,1);
        }
    }
    return temp;
}







/**********************
* 기간 세팅된 달력
*  ex : setFromToDay('input box의 name', '시작일yyyymmdd', '종료일yyyymmdd')
* @param : 리턴값이 들어갈 input의 name
* @return : void
* @see
************************/
function fromToDayCalendar(name, locale, evt, fromDay, toDay, isBizCheck, isTodayBtn){
    setFromToDay(name, fromDay,toDay);
    openCalendar(name, locale, evt, isBizCheck, isTodayBtn);
    return false;
}

/**********************
* 달력 날짜 지정하기
*  ex : setFromToDay('input box의 name', '시작일yyyymmdd', '종료일yyyymmdd')
* @param : 리턴값이 들어갈 input의 name
* @return : void
* @see
************************/
function setFromToDay(name, fromDay, toDay){
    document.getElementById("calendarSet").innerHTML = "<input type='hidden' name='"+name+"fromday' id='"+name+"fromday' />"
                                                                                + "<input type='hidden' name='"+name+"today' id='"+name+"today' />";
    eval( "document.getElementById(\""+name+"fromday\")" ).value = fromDay ;
    eval( "document.getElementById(\""+name+"today\")" ).value = toDay ;
    return;
}






/**********************

* 문자열을 전각문자열로 변환 (문자열의 반각문자를 전각문자로 변환함)

* @param : x_string 변환할 문자열
* @return : 변환된 전각문자열
* @see
************************/
function convert2ByteCharToString(x_string) {
    var x_2byteString = ""; /* 컨버트된 문자 */
    for(i=0;i < x_string.length;i++) {
        var c = x_string.charCodeAt(i);
        if(32 <= c && c <= 126) { /* 전각으로 변환될수 있는 문자의 범위 */
            if(c == 32) { /* 스페이스인경우 ascii 코드 32 */
                /* 아래와 같이 변환시 깨짐. */
                x_2byteString = x_2byteString + unescape("%u"+gf_DecToHex(12288));
            } else {
                x_2byteString = x_2byteString + unescape("%u"+gf_DecToHex(c+65248));
            }
        }else{
            x_2byteString = x_2byteString + x_string.charAt(i);
        }
    }

    return  x_2byteString;
}




/**********************
* 반각문자를 전각문자로 변환한다.
* @param : 전각문자로 변환할 문자
* @return : 변환된 전각문자
* @see
************************/
function convert2ByteChar(x_char) {
    var x_2byteChar = ""; /* 컨버트된 문자 */
    var c = x_char.charCodeAt(0);
    if(32 <= c && c <= 126) { /* 전각으로 변환될수 있는 문자의 범위 */
        if(c == 32) { /* 스페이스인경우 ascii 코드 32 */
            /* 아래와 같이 변환시 깨짐. */
            x_2byteChar = unescape("%u"+gf_DecToHex(12288));
        } else {
            x_2byteChar = unescape("%u"+gf_DecToHex(c+65248));
        }
    }
    return  x_2byteChar;
}


/**
 * 16진수로 변환
 */
function gf_DecToHex(dec) {
    return dec.toString(16);
}




/**********************
* 문자 방지(한글 제외)
*  ex : ONKEYPRESS="hasOnlyNumber();"
* @param : boolean
* @return : void
* @see
************************/
function hasOnlyNumber(Obj, event){
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    var keyCode = event.which ? event.which :
            event.which ? event.which : event.charCode;
    if(keyCode > 222) return false;        /*  Select Box외 기타 이벤트 방지 */
    if (keyCode != 13) {
        if( !((keyCode>45 && keyCode<58) || (keyCode>95 && keyCode<106) || (keyCode>7 && keyCode<10) || (keyCode>36 && keyCode<41)) ){

            i18nExtAlert(hasOnlyNumber_str);
            if(Obj == null) {
                    event.returnValue = false;
                } else {
                    Obj.value = "";
                Obj.focus();
                }
        }
    }
}


/**********************
* 익스플로러 버젼 찾기
*  ex : ONKEYPRESS="javascript:getNavigatorInfoStr();"
* @param : boolean
* @return : void
* @see
************************/
function getNavigatorInfoStr()
{
    var name = navigator.appName, ver = navigator.appVersion,
        ver_int = parseInt(navigator.appVersion), ua = navigator.userAgent, infostr;
    if(name == "Microsoft Internet Explorer")
    {
        if(ver.indexOf("MSIE 3.0") != -1) return "Internet Explorer 3.0x";
        if(ver_int != 4) return "Internet Explorer " + ver.substring(0, ver.indexOf(" "));

        var real_ver = parseInt(ua.substring(ua.indexOf("MSIE ") + 5));
        if(real_ver >= 7) infostr = "Windows Internet Explorer ";
        else infostr = "Microsoft Internet Explorer ";

        if(ua.indexOf("MSIE 5.5") != -1) return infostr + "5.5";
        else return infostr + real_ver + ".x";

        return "Internet Explorer";
    }
    else if(name == "Netscape")
    {
        if(parseInt(ua.substring(8, 8)) <= 4)
          return "Netscape " + ver.substring(0, ver.indexOf(" "));
        else if(ua.lastIndexOf(" ") < ua.lastIndexOf("/"))
          return ua.substring(ua.lastIndexOf(" "));
        else return "Netscape";
    }
    else return name;
}

/**********************
* 오른쪽부터 문자열에 0을 넣어줌
*  ex : zerolpad('1234567890', 15);
* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function rPadZero(orgStr,strlen)
{
    if (orgStr.length > parseInt(strlen))
    {
        return "-1";
    }
    else
    {
        var loopCnt = (parseInt(strlen) - orgStr.length);

        for(var idx = 0;idx < loopCnt;idx++)
        {
            orgStr = orgStr + "0";
        }

        return orgStr;
    }
}
/**********************
* 일자를 더해주는 함수(onClickSetDate에서 사용)
* @param : 년도 4자리
* @param : 월 2자리
* @param : 일 2자리
* @param : 계산할 일
* @return : 계산된 날짜
* @see
************************/
function addDay(yyyy, mm, dd, pDay) /*  년, 월, 일, 계산할 일자 (년도는 반드시 4자리로 입력) */
{
    var oDate;                         /*  리턴할 날짜 객체 선언 */
    dd = dd*1 + pDay*1;                /*  날짜 계산 */
    mm--;                              /*  월은 0~11 이므로 하나 빼준다 */
    oDate = new Date(yyyy, mm, dd);    /*  계산된 날짜 객체 생성 (객체에서 자동 계산) */
    return oDate;
}
/**********************
* 달을 더해주는 함수(onClickSetDate에서 사용)
* @param : 년도 4자리
* @param : 월 2자리
* @param : 일 2자리
* @param : 계산할 달
* @return : 계산된 날짜
* @see
************************/
function addMonth(yyyy, mm, dd, pMonth) /*  년, 월, 일, 계산할 월 (년도는 반드시 4자리로 입력) */
{
    var cDate;                                                    /*  계산에 사용할 날짜 객체 선언 */
    var oDate;                                                    /*  리턴할 날짜 객체 선언 */
    var cYear, cMonth, cDay;                                      /*  계산된 날짜값이 할당될 변수 */
    mm        = mm*1 + ((pMonth*1)-1);                              /*  월은 0~11 이므로 하나 빼준다 */
    cDate    = new Date(yyyy, mm, dd);                             /*  계산된 날짜 객체 생성 (객체에서 자동 계산) */
    cYear    = cDate.getFullYear();                                /*  계산된 년도 할당 */
    cMonth    = cDate.getMonth();                                   /*  계산된 월 할당 */
    cDay    = cDate.getDate();                                    /*  계산된 일자 할당 */
    oDate    = (dd == cDay) ? cDate : new Date(cYear, cMonth, 0);  /*  넘어간 월의 첫쨋날 에서 하루를 뺀 날짜 객체를 생성한다. */

return oDate;
}

/**********************
* 시작날짜와 종료일자를 기간만큼 넣어주는 함수
*  ex : onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'0d');" : 오늘
*            onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'1d');" : 어제
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'6d');" : 최근 1주
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'13d');" : 최근 2주
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'', '1m');" : 한달전
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'', '3m');" : 세달전

* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function onClickSetDate(fromObj, toObj, termDay, termMonth) {
/*
    var today = new Date();
    var preDay;
    var yyyy = today.getYear();

    var mm = today.getMonth()+1;
    var dd = today.getDate();


    dd = (dd<10)?'0'+dd:dd;
    mm = (mm<10)?'0'+mm:mm;


    preDay = getPrevDate(""+yyyy +""+ mm + ""+dd, term);

    fromObj.value = getPrevDate(""+yyyy + ""+mm +""+ dd, term);
    toObj.value = getPrevDate(""+yyyy +""+ mm +""+ dd, "0d");
*/
    var reg = /([-]*[0-9]+)([d|m])/g;

    var today = new Date();
    var preDay, resDay, resMonth;
    var yyyy    = today.getYear();
    var mm      = today.getMonth()+1;
    var dd      = today.getDate();


    var fromyyyy    = "";
    var frommm    = "";
    var fromdd    = "";

    dd = (dd<10)?'0'+dd:dd;
    mm = (mm<10)?'0'+mm:mm;


    toObj.value = yyyy + "" + mm + "" + dd;

    var cDate;

    /* 일자만 넣고 달을 넣지 않았을 때 */
    if(termDay != "" && termMonth == undefined)
    {
        resDay = reg.exec(termDay);
        cDate = addDay(yyyy, mm, dd, (parseInt(resDay[1])*-1));

    } /* 달만 빼기를 했을 때 */
    else if(termDay == "" && termMonth != undefined && termMonth != "")
    {
        resMonth = reg.exec(termMonth);

        cDate        = addMonth(yyyy, mm, dd, (parseInt(resMonth[1])*-1));
        fromyyyy     = cDate.getFullYear();
        frommm       = (cDate.getMonth()+1);
        fromdd       = cDate.getDate();
        /* 이전 달의 경우에는 한달을 뺀 다음에 하루를 더 더해야함 */
        cDate        = addDay(fromyyyy, frommm, fromdd, 1)
    }

    fromyyyy = cDate.getFullYear();
    frommm = (cDate.getMonth()+1);
    fromdd = cDate.getDate();

    frommm = (frommm<10)?'0'+frommm:frommm;
    fromdd = (fromdd<10)?'0'+fromdd:fromdd;


    fromObj.value =  ""+fromyyyy + ""+frommm + ""+fromdd;

}

/**********************
* 시작날짜와 종료일자를 기간만큼 넣어주는 함수
*  ex : onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'0d');" : 오늘
*            onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'1d');" : 어제
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'7d');" : 최근 1주
*           onclick="onClickSetDate(document.frm.거래일자_시작, document.frm.거래일자_끝,'14d');" : 최근 2주
* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function onClickSetDate2(obj1, obj2, term) {
 var reg = /([0-9-]+)([d|m])/g;
 var res = reg.exec(term);
 if(res == null) {
  return false;
 }
 var termCnt = parseInt(res[1], 10);
 var termStr = res[2];
 var endDate = new Date();
 var startDate = null;
 if(termStr == "d") {
    termCnt = (termCnt > 0) ? termCnt-1 : ((termCnt < 0) ? termCnt+1 : 0);
  startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()-termCnt);
 }else if(termStr == "m") {
  startDate = new Date(endDate.getFullYear(), endDate.getMonth()-termCnt, endDate.getDate()+1);
 }else {
  return false;
 }
 obj1.value = startDate.getFullYear()+"-"+ (startDate.getMonth()<9 ? "0" : "")+(startDate.getMonth()+1) + "-" + (startDate.getDate()<10 ? "0" : "")+startDate.getDate();
 obj2.value = endDate.getFullYear()+"-"+ (endDate.getMonth()<9 ? "0" : "")+(endDate.getMonth()+1) + "-" + (endDate.getDate()<10 ? "0" : "")+endDate.getDate();
 return false;
}


/**********************
* 시작날짜와 종료일자를 기간만큼 넣어주는 함수(카드 전용-양편넣기)
* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function onClickSetDate3(obj1, obj2, term) {
 var reg = /([0-9]+)([d|m])/g;
 var res = reg.exec(term);
 if(res == null) {
  return false;
 }
 var termCnt = parseInt(res[1], 10);
 var termStr = res[2];
 var endDate = new Date();
 var startDate = null;
 if(termStr == "d") {
    termCnt = (termCnt > 0) ? termCnt-1 : 0;
  startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()-termCnt);
 }else if(termStr == "m") {
  startDate = new Date(endDate.getFullYear(), endDate.getMonth()-termCnt, endDate.getDate()+1);
 }else {
  return false;
 }
 obj1.value = startDate.getFullYear()+"-"+ (startDate.getMonth()<9 ? "0" : "")+(startDate.getMonth()+1) + "-" + (startDate.getDate()<10 ? "0" : "")+startDate.getDate();
 obj2.value = endDate.getFullYear()+"-"+ (endDate.getMonth()<9 ? "0" : "")+(endDate.getMonth()+1) + "-" + (endDate.getDate()<10 ? "0" : "")+endDate.getDate();
 return false;
}



/**********************
* 시작날짜와 종료일자를 기간만큼 넣어주는 함수(단편넣기)
* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function onClickSetDateS(fromObj, toObj, termDay, termMonth) {


    var reg = /([-]*[0-9]+)([d|m])/g;

    var today = new Date();
    var preDay, resDay, resMonth, yyyy, mm, dd;
    /*if(toObj.value == "")
    {
        yyyy    = today.getYear();
        mm      = today.getMonth()+1;
        dd      = today.getDate();
    }
    else
    {
        yyyy    = toObj.value.substring(0, 4);
        mm      = parseInt(toObj.value.substring(4, 6), 10);
        dd      = toObj.value.substring(6, 8);
    }*/
    yyyy    = today.getYear();
    mm      = today.getMonth()+1;
    dd      = today.getDate();



    var fromyyyy    = "";
    var frommm    = "";
    var fromdd    = "";

    dd = (dd<10)?'0'+dd:dd;
    mm = (mm<10)?'0'+mm:mm;


    toObj.value = yyyy + "" + mm + "" + dd;

    var cDate;

    /* 일자만 넣고 달을 넣지 않았을 때 */
    if(termDay != "" && termMonth == undefined)
    {
        resDay = reg.exec(termDay);
        cDate = addDay(yyyy, mm, dd, (parseInt(resDay[1])*-1));

    } /* 달만 빼기를 했을 때 */
    else if(termDay == "" && termMonth != undefined && termMonth != "")
    {
        resMonth = reg.exec(termMonth);

        cDate        = addMonth(yyyy, mm, dd, (parseInt(resMonth[1])*-1));
        fromyyyy     = cDate.getFullYear();
        frommm       = (cDate.getMonth()+1);
        fromdd       = cDate.getDate();
        /* 이전 달의 경우에는 한달을 뺀 다음에 하루를 더 더해야함 */
        /* cDate        = addDay(fromyyyy, frommm, fromdd, 1) */
    }

    fromyyyy = cDate.getFullYear();
    frommm = (cDate.getMonth()+1);
    fromdd = cDate.getDate();

    frommm = (frommm<10)?'0'+frommm:frommm;
    fromdd = (fromdd<10)?'0'+fromdd:fromdd;


    fromObj.value =  ""+fromyyyy + ""+frommm + ""+fromdd;

}


/**********************
* 시작날짜와 종료일자를 기간만큼 넣어주는 함수(양편넣기)
* @param : 원천 문자열
* @param : 반환하고자하는 문자열 길이
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function onClickSetDateB(fromObj, toObj, termDay, termMonth) {
    fromObj.value = "";
    toObj.value = "";
    onClickSetDateS(fromObj, toObj, termDay, termMonth);
    /* 하루를 더 더해줌 */
    onClickSetDateS(fromObj, fromObj, '-1d');

}


/**********************
* 달의 마지막 일자를 가져오는 함수
*  ex : getLastDay('2009', '01');
* @param : yyyy 기준년
* @param : mm   월
* @return : 마지막 일자
* @see
************************/
function getLastDay(x1,x2){  /*  년,월 을 입력하면 마지막 날을 가져온다. */
    var rtn = "";
    var tempDate = new Date(x1,x2,1);
    tempDate.setDate(0);
    rtn = tempDate.getDate();
    return rtn;
}

/**********************
* 이전일자를 가져오는 함수
*  ex : getPrevDate('20081011', 1d); 어제
* @param : yyyymmdd 기준년월일
* @param : term   이전일자의 수
* @return : 오른쪽에 '0'이 문자열의 길이(strlen)만큼 채워진 문자열 반환
* @see
************************/
function getPrevDate(yyyymmdd, term) {
    var yyyy;
    var mm;
    var dd;
    if ( yyyymmdd.length != 8  ){

        var today = new Date() ;
        yyyy = today.getYear()  ;
        mm = today.getMonth()+1 ;
        dd = today.getDate() ;
        dd = (dd<10)?'0'+dd:''+dd;
        mm = (mm<10)?'0'+mm:''+mm;
    }else{
        yyyy = yyyymmdd.substring(0, 4);
        mm = yyyymmdd.substring(4, 6);
        dd = yyyymmdd.substring(6, 8);
    }


    myDate = new Date();
    myDate.setFullYear(yyyy);
    myDate.setMonth(mm-1);
    myDate.setDate(dd);

    if(term.charAt(term.length-1) == 'd'){
        term = term.substring(0, term.length-1);
        myDate.setDate(dd - eval(term) );
    }


    if(term.charAt(term.length-1) == 'm'){
        term = term.substring(0, term.length-1);

        if(getLastDay(yyyy,mm) == dd) {
            myDate.setDate('01');
            myDate.setMonth(mm - eval(term));

        } else {
            myDate.setMonth(mm - eval(term) -1);
            myDate.setDate(myDate.getDate() + 1);
        }
    }


    yyyy = myDate.getYear();
    mm = myDate.getMonth()+1;
    dd = myDate.getDate();

    dd = (dd<10)?'0'+dd:dd;
    mm = (mm<10)?'0'+mm:mm;

    return ("" + yyyy + "" + mm+ "" + dd);
}

/**********************
* 주민 번호 체크 로직
*  ex : validatePsn("1111111111111")
* @param : 주민번호 13자리 스트링값
* @return : boolean
* @see
************************/
function validatePsn(psnno, elem)
{
    var gsJuminNo = "";

    if (psnno == null || psnno == "" || psnno.length != 13)
    {
        if(elem != " undefined") i18nExtAlert(validatePsn_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validatePsn_str1);
        return  false;
    }
    else
    {
        /*  숫자가 아닌것이 있으면: false; */
        var numreg = /[^0-9]/g;
        if ( numreg.test(psnno) )/* 숫자 아닌 값이 있는지 체크, 공백,영문,한글,특수기호 모두 체크 */
        {
            if(elem != " undefined") i18nExtAlert(validatePsn_str1,"",null,_fU_localeCode,eval(elem));
            else i18nExtAlert(validatePsn_str1);
            return false;
        }
    }


    /* 외국인일 경우 주민번호 검증 체크를 하지 않는다. (7번째 값이 5,6,7,8,9,0 일경우) */
    if(psnno.substring(6,7) == 0 || (psnno.substring(6,7) >= 5 && psnno.substring(6,7) <=9)) {
    	return true;
    }

   	/*  주민등록 체크섬 검사 */
    var psnSumCheckArr = new String("234567892345");
    var psnSum = 0;
    var psnSumResult = "";
    for (var i = 0; i < 13; i++)
    {
        psnSum = psnSum + (psnno.substring(i, i+1) * psnSumCheckArr.substring(i, i+1));
    }
    psnSumResult = (11 - (psnSum % 11)) % 10;

    if(psnSumResult == psnno.substring(12, 13) )
    {
        delete psnSumCheckArr;
        return true;
    }
    else
    {
        delete psnSumCheckArr;
        if(elem != " undefined") i18nExtAlert(validatePsn_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validatePsn_str1);
        return false;
    }
}




/**********************
* 이메일 체크 함수
*  ex : validateEmail("aaaa@empas.com")
* @param : 이메일 스트링값
* @return : boolean
* @see
************************/
function validateEmail(varemail,elem)
{
    /* var emailReg = /^([A-Za-z0-9]{0,1})([A-Za-z0-9]{1,15})([A-Za-z0-9\\_.-]{0,1})([A-Za-z0-9]{1,15})([A-Za-z0-9]{0,1})(@{1})([A-Za-z0-9_]{1,15})(.{1})([A-Za-z0-9_]{2,10})(.{1}[A-Za-z]{2,10})?(.{1}[A-Za-z]{2,10})?$/; */
    var emailReg = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;

    if ( !emailReg.test(varemail) )
    {
        if(elem != undefined) i18nExtAlert(validateEmail_str,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validateEmail_str);
        return false;
    }
    return true;
}

/**********************
* 사업자 번호 체크
*  ex : validateCrn("1111111111")
* @param : 사업자번호 스트링값
* @return : boolean
* @see
************************/
function validateCrn(crn, elem)
{
    if(crn.length != 10)
    {
        if(elem != "undefined") i18nExtAlert(validateCrn_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validateCrn_str1);
        return false;
    }
    var sum = 0;
    var getlist =new Array(10);
    var chkvalue =new Array("1","3","7","1","3","7","1","3","5");

    for (var i=0;i<10;i++)
        getlist[i] = crn.substring(i,i+1);

    for (var i=0;i<9;i++)
        sum += getlist[i]*chkvalue[i];

    sum = sum +parseInt((getlist[8]*5)/10) ;
    var sidliy = sum%10;
    var sidchk = 0;

    if( sidliy != 0 )
        sidchk = 10 - sidliy;
    else
        sidchk = 0;

    delete chkvalue;
    if( sidchk != getlist[9] )
    {
        delete getlist;
        if(elem != undefined) i18nExtAlert(validateCrn_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validateCrn_str1);
        return false;
    }
    delete getlist;
    return true;

}


/**********************
* 주민 사업자 번호 체크
*  ex : validatePsnCrn("1111111111") or validatePsnCrn("1111111111111")
* @param : 주민 사업자번호 스트링값
* @return : boolean
* @see
************************/
function validatePsnCrn(data,elem)
{
    data = getOnlyNumberFormat(data);/* 숫자만 입력 받기. */
    if(data.length == 13)
    {
        return validatePsn(data,elem);
    } else if(data.length == 10)
    {
        return validateCrn(data,elem);
    } else
    {
        if(elem != undefined) i18nExtAlert(validatePsnCrn_str,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert(validatePsnCrn_str);
        return false;
    }
}

/**********************
* 8자리 날짜 체크 로직
*  ex : validateDate8("20050822")
* @param : 8자리 날짜 스트링
* @return : boolean
* @see
************************/

function validateDate8(cDate,elem)
{
    if(cDate.length != 8)
    {
        /* alert(validateDate8_str1); */
        /* i18nExtAlert( validateDate8_str1); //alert 메세지 함수 호출 */
        if(elem != undefined) i18nExtAlert( validateDate8_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert( validateDate8_str1);
        return false;
    }
    var yyyy = cDate.substring(0, 4);
    var mm = cDate.substring(4, 6) - 1;/* 12월일 경우 날짜 생성해서 보면 getMonth()로 보면 0으로 리턴되므로 1을 빼준다. */
    var dd = cDate.substring(6);
    var checkDate = new Date(yyyy, mm, dd);

    if ( checkDate.getFullYear() != yyyy ||    checkDate.getMonth() != mm || checkDate.getDate() != dd)
    {
        delete checkDate;
        /* alert(validateDate8_str2); */
        if(elem != undefined) i18nExtAlert( validateDate8_str2,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert( validateDate8_str2);
        /* i18nExtAlert( validateDate8_str2); //alert 메세지 함수 호출 */
        return false;
    }
    delete checkDate;
    return true;

}

/**********************

* 6자리 날짜 체크 로직 (YYYYMM) - 년도, 월
*  ex : validateDate8("200508")

* @param : 6자리 날짜 스트링
* @return : boolean
* @see
************************/

function validateDate6(cDate,elem)
{
    if(cDate.length != 6)
    {
        /* alert(validateDate8_str1); */
        i18nExtAlert( validateDate8_str1); /* alert 메세지 함수 호출 */
        if(elem != undefined) i18nExtAlert( validateDate8_str1,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert( validateDate8_str1);
        return false;
    }
    var yyyy = cDate.substring(0, 4);
    var mm = cDate.substring(4, 6) - 1;/* 12월일 경우 날짜 생성해서 보면 getMonth()로 보면 0으로 리턴되므로 1을 빼준다. */
    var checkDate = new Date(yyyy, mm);

    if ( checkDate.getFullYear() != yyyy ||    checkDate.getMonth() != mm)
    {
        delete checkDate;
        if(elem != undefined) i18nExtAlert( validateDate8_str2,"",null,_fU_localeCode,eval(elem));
        else i18nExtAlert( validateDate8_str2);
        /* i18nExtAlert( validateDate8_str2); //alert 메세지 함수 호출 */
        return false;
    }
    delete checkDate;
    return true;

}

/**********************

* 외환은행 계좌 체크 로직(현재 길이만 체크하고 있음)
*  ex : validateKebAccount("111111111111")

* @param : 계좌 번호
* @return : boolean
* @see
************************/
function validateKebAccount(acc)
{
    if(acc.length != 12)
    {
        alert(validateKebAccount_str);
        return false;
    }
    return true;
}


/**********************
* 외환은행 계좌 비밀번호 로직(현재 길이만 체크하고 있음)
*  ex : validateKebAccountPassword("1111")
* @param : 계좌 번호
* @return : boolean
* @see
************************/
function validateKebAccountPassword(pass)
{
    if(pass.length != 4)
    {
        alert(validateKebAccountPassword_str);
        return false;
    }
    return true;
}



/**********************
* 스크립트로 제어하는 대분류,중분류에 사용하는 셀렉트 박스 컨트롤
*  ex : dynamicChangeSelectBox(this,form1.targetname,target에들어갈array,true)
* @param : 이 스크립트를 실행하는 select box 객체
* @param : 이 객체의 onchange 이벤트에 의해 제어될 타겟 select box 객체 name
* @param : 타켓 셀렉트 박스에 조건에 따라서 들어갈 옵션이 들어있는 javascript array 객체명
* @param : 선택하세요.. 사용 여부
* @return : void
* @see
************************/
function dynamicChangeSelectBox(select,target,resultSet,nulluse,basicOption,selected)
{
    var upperState = "";
    if (select.upperValue != undefined)
        upperState = select.upperValue;

    var selectValue = "";

    if(upperState != "")
        selectValue = upperState+"_"+select.value;
    else
        selectValue = select.value;

    while(target.length > 0)
    {
        target.removeChild(target.children[0]);
    }

    if(nulluse == true)
    {
        var option = document.createElement("OPTION");
        option.text= dynamicChangeSelectBasicOpt;
        if(basicOption != undefined) {option.text=basicOption;}
        option.value="";
        target.add(option);
    }

    if(resultSet[selectValue] != undefined )
    {
        var selectArray = resultSet[selectValue];

        if(selectArray.length != 0)
        {

            for(var t = 0 ; t < selectArray.length ; t++)
            {
                var option = new Option();
                option.value=selectArray[t][0];
                option.text=selectArray[t][1];

                target.add(option);

                if(option.value == selected && selected != 'undefined' && selected != undefined && selected != '' && selected != null ) {
					target[target.length-1].selected = true;
   				}
            }
        }

    }

    target.upperValue = selectValue;/* 방금 선택한 셀렉트 박스 값과 대분류를 통해서 왔을때의 값을 대상에 심어놓음으로서 키의 중복을 방지 */

    if(target.onchange != null)
        target.onchange();

}


/**********************
* 특수문자 있는지 확인하는 함수
*  ex : isSChar("...");
* @param : 특수문자가 포함된 문자열
* @return : boolean
* @see
************************/
function isSChar(fullstr){

    for(var i=0; i < fullstr.length; i++) {

        var str = substr(fullstr, i, 1);

        if ( str != NULL && length(str) > 0){
            if( IndexOf(str, "`") >= 0 ) return false;
            if( IndexOf(str, "~") >= 0 ) return false;
            if( IndexOf(str, "!") >= 0 ) return false;
            if( IndexOf(str, "@") >= 0 ) return false;
            if( IndexOf(str, "#") >= 0 ) return false;
            if( IndexOf(str, "$") >= 0 ) return false;
            if( IndexOf(str, "%") >= 0 ) return false;
            if( IndexOf(str, "^") >= 0 ) return false;
            if( IndexOf(str, "&") >= 0 ) return false;
            if( IndexOf(str, "*") >= 0 ) return false;
            if( IndexOf(str, "(") >= 0 ) return false;
            if( IndexOf(str, ")") >= 0 ) return false;
            if( IndexOf(str, "-") >= 0 ) return false;
            if( IndexOf(str, "_") >= 0 ) return false;
            if( IndexOf(str, "+") >= 0 ) return false;
            if( IndexOf(str, "=") >= 0 ) return false;
            if( IndexOf(str, "|") >= 0 ) return false;
            if( IndexOf(str, "[") >= 0 ) return false;
            if( IndexOf(str, "]") >= 0 ) return false;
            if( IndexOf(str, "{") >= 0 ) return false;
            if( IndexOf(str, "}") >= 0 ) return false;
            if( IndexOf(str, ":") >= 0 ) return false;
            if( IndexOf(str, ";") >= 0 ) return false;
            if( IndexOf(str, "<") >= 0 ) return false;
            if( IndexOf(str, ">") >= 0 ) return false;
            if( IndexOf(str, "?") >= 0 ) return false;
            if( IndexOf(str, ",") >= 0 ) return false;
            if( IndexOf(str, ".") >= 0 ) return false;
            if( IndexOf(str, "/") >= 0 ) return false;
        }

    }


    return true;
}



/**********************
* 알파벳 대문자, 숫자, 특수문자(- ? : ( ) . ,' +) 있는지 확인하는 함수
*  ex : isSChar("...");
* @param : 특수문자가 포함된 문자열
* @return : boolean
* @see
************************/
function isChkSChar(fullstr){

    for(var i=0; i < fullstr.length; i++) {

        var str = substr(fullstr, i, 1);

        if ( str != NULL && length(str) > 0){
            if( IndexOf(str, "`") >= 0 ) return false;
            if( IndexOf(str, "~") >= 0 ) return false;
            if( IndexOf(str, "!") >= 0 ) return false;
            if( IndexOf(str, "@") >= 0 ) return false;
            if( IndexOf(str, "#") >= 0 ) return false;
            if( IndexOf(str, "$") >= 0 ) return false;
            if( IndexOf(str, "%") >= 0 ) return false;
            if( IndexOf(str, "^") >= 0 ) return false;
            if( IndexOf(str, "&") >= 0 ) return false;
            if( IndexOf(str, "*") >= 0 ) return false;
            if( IndexOf(str, "_") >= 0 ) return false;
            if( IndexOf(str, "=") >= 0 ) return false;
            if( IndexOf(str, "|") >= 0 ) return false;
            if( IndexOf(str, "[") >= 0 ) return false;
            if( IndexOf(str, "]") >= 0 ) return false;
            if( IndexOf(str, "{") >= 0 ) return false;
            if( IndexOf(str, "}") >= 0 ) return false;
            if( IndexOf(str, ";") >= 0 ) return false;
            if( IndexOf(str, '"') >= 0 ) return false;
            if( IndexOf(str, "<") >= 0 ) return false;
            if( IndexOf(str, ">") >= 0 ) return false;
            if( IndexOf(str, "/") >= 0 ) return false;
        }

    }


    return true;
}


/**********************
* 값의 길이가 자리수와 같은지? focus 이동
*  ex : isLengthAndMoveFocus(this,3,document.IES5701P_1.numNO2)
* @param : 비교할 첫번째 문자열
* @param : 길이
* @param : 비교할 두번째 문자열
* @return : void
* @see
************************/
function isLengthAndMoveFocus(obj1,length,obj2) {

    if(isLength(obj1,length)) obj2.focus();

}

/**********************
* 값의 길이가 자리수와 같은지?
*  ex : isLength(this,3)
* @param : 비교할 첫번째 문자열
* @param : 길이
* @return : void
* @see
************************/
function isLength(obj, length) {

    if ( obj.value.length == length ) {
        return  true;
        } else {
        return false;
    }
}

/**********************
* 키값을 체크함(엔터키 입력시 ValidateForm실행)
*  ex :
* @param :
* @return : void
* @see
************************/
function check_key(event) {
    event = checkEvent(event);  /* 이벤트 값 가져오기 */
    if(event.which == 13) ValidateForm();
}

/**********************
* 사업자 번호 masking
*  ex :
* @param : 사업자번호
* @return : void
* @see
************************/
function makeBzNo(str){
    var strLeft = "";
    var strCenter ="";
    var strRight = "";
    var strReturn = "";

    if( str.substring(0,3) == "999" ){
        strLeft = str.substring(3,6);
        strCenter = str.substring(6,8);
        strRight = str.substring(8,13);
    }
    else{
        strLeft = str.substring(0,3);
        strCenter = str.substring(3,5);
        strRight = str.substring(5,10);
    }
    strReturn = strLeft + "-" + strCenter  + "-" + strRight;

    document.write(strReturn);
}

/**********************
* 주민/사업자 번호 masking
*  ex :
* @param : 사업자번호
* @return : void
* @see
************************/
function makeBzNo2(str){
    var strLeft = "";
    var strCenter ="";
    var strRight = "";
    var strReturn = "";

    if( str.substring(0,3) == "999" ){
        strLeft = str.substring(3,6);
        strCenter = str.substring(6,8);
        strRight = str.substring(8,13);

        strReturn = strLeft + "-" + strCenter  + "-" + strRight;
    }
    else{
        strLeft = str.substring(0,6);
        strRight = str.substring(6,13);
        strReturn = strLeft + "-"  + strRight;
    }

    document.write(strReturn);
}

/**********************
* 법인,계약번호 masking
*  ex :
* @param : 법인,계약번호
* @param : 왼쪽자리수
* @param : 오른쪽자리수
* @return : void
* @see
************************/
function makeCorpNo(str, left, right){
    var strLeft ="";
    var strRight = "";
    var strReturn = "";

    strLeft = str.substring(0, left);
    strRight = str.substring(left, left + right);

    strReturn = strLeft + "-" + strRight;

    document.write(strReturn);

}


/**********************
* 대출번호 masking
*  ex :
* @param : 법인,계약번호
* @param : 왼쪽자리수
* @param : 중간자리수
* @param : 오른쪽자리수
* @return : void
* @see
************************/
function makeLendNo(str, left, mid, right){
    var strLeft ="";
    var strMid ="";
    var strRight = "";

    var strReturn = "";

    strLeft = str.substring(0, left);
    strMid = str.substring(left, left + mid);
    strRight = str.substring(left + mid, left + mid + right);

    strReturn = strLeft + "-" + strMid + "-" + strRight;

    document.write(strReturn);

}

/**********************
* 대출번호 masking2(return 용)
* @param : 법인,계약번호
* @param : 왼쪽자리수
* @param : 중간자리수
* @param : 오른쪽자리수
* @return : 마스킹처리된 법인번호 및 계약번호
* @see
************************/
function makeLendNo2(str, left, mid, right){
    var strLeft ="";
    var strMid ="";
    var strRight = "";

    var strReturn = "";

    strLeft = str.substring(0, left);
    strMid = str.substring(left, left + mid);
    strRight = str.substring(left + mid, left + mid + right);

    strReturn = strLeft + "-" + strMid + "-" + strRight;

    return strReturn;

}


/**********************
* 계좌번호로부터 원화/외화 계좌를 판단하여 외화계좌일경우 True를 넘겨주는 함수
*  ex : getForeignAccYn("655-134123-532-USD")
* @param : 외환은행계좌번호(ComboBox의 Text를 넘길것)
* @return : boolean
* @see
************************/
function getForeignAcctYn(stAcct)
{
    stAcct = stAcct.replace(/-/g,"");
    if( stAcct.length > 12 ) { return true; }
    else
    {
        if(stAcct.indexOf("J") != -1) return true;
        else return false;
    }
}


/**********************
* 현재일과 만기일을 인수로 받아서 현재일보다 과거인지 검사한다.
*  ex : checkTerm("20061025","20071031")4",3)
* @param : 조회 시작일(yyyymmdd)
* @param : 조회 기간(yyyymmdd)
* @return : boolean
* @see
************************/
function checkTerm(fdate,tdate)
{
    return amtRegExp(fdate)<=amtRegExp(tdate);
}


/**********************
* 날짜 비교 함수
*  ex : checkTerm("20061025","20071031")4",3)
* @param : 조회 시작일(yyyymmdd)
* @param : 조회 기간(yyyymmdd)
* @return : int
* @see
************************/
function compareDate(strParam1, strParam2) {
    var dateParam1, dateParam2;
    if(strParam1.length == 10) strParam1 =     strParam1.substring(0,4) + strParam1.substring(5,7) + strParam1.substring(8,10);
    if(strParam2.length == 10) strParam2 =     strParam2.substring(0,4) + strParam2.substring(5,7) + strParam2.substring(8,10);
    dateParam1 = new Date(strParam1.substring(0,4), strParam1.substring(4,6), strParam1.substring(6,8), 0, 0, 0, 0);
    dateParam2 = new Date(strParam2.substring(0,4), strParam2.substring(4,6), strParam2.substring(6,8), 0, 0, 0, 0);
    return dateParam1 - dateParam2;
}

/**********************
* 폼의 객체에 금액을 넣는 함수
*  ex : fillMoney("frm1","money")
* @param : form이름
* @param : Object명
* @return : Object명
* @see
************************/
function fillMoney(elmNm, money)
{
    var ele;

    ele = document.getElementsByName(elmNm);

    ele.value = money;
}
/**********************
* 체크박스상태를 반환하는 함수
*  ex : isChecked("money")
* @param : Object명
* @return : boolean
* @see
************************/
function isChecked(eleName)
{
    var collection = document.getElementsByName(eleName);
    for(var i=0; i<collection.length; i++)
    {
        if(collection[i].checked)
        {
            return true;
        }
    }

    return false;
}

/**********************
* 체크박스에 체크로 세팅하는 함수
*  ex : setChecked("money")
* @param : Object명
* @return : void
* @see
************************/
function setChecked(eleName)
{
    var collection = document.getElementsByName(eleName);
    for(var i=0; i < collection.length; i++)
    {
        collection[i].checked = true;
    }
}

/**********************
* 체크박스에 체크로 해제하는 함수
*  ex : removeChecked("money")
* @param : Object명
* @return : void
* @see
************************/
function removeChecked(eleName)
{
    var collection = document.getElementsByName(eleName);
    for(var i=0; i<collection.length; i++)
    {
        collection[i].checked = false;
    }
}

/**********************
* 메뉴링크(익스플로러인 경우에는 XecureNavigate를 실행하고 아닐 경우에는 location.href를 실행)
*  ex : xecureLink(url,"_self");
* @param : url경로
* @param : 프레임의 타켓 경로
* @return : void
* @see
************************/
function xecureLink(url) {
    /* 모질라나 Nescape 계열 브라우저인지 체크하는 함수 */
    var browserName = getNavigatorInfoStr();

    if(browserName.indexOf("Internet Explorer") > 0)
    {
        XecureNavigate(url,"_self");
    }
    else
    {
        document.location.href = url;
    }
}


/**********************
* 문자열 치환 스크립트
*  ex : stringMask("011-9516-6214", 9, 13, '*')
* @param : orgStr 변환전 문자열
* @param : strPos 변환될 처음위치
* @param : endPos 변환될 마지막위치
* @param : replaceChar 치환문자(1자가능)
* @return : str  치환된 문자열
* @see
************************/
function stringMask(orgStr, strPos, endPos, replaceChar)
{
    var chgStr = "";
    var strLen = orgStr.length;
    /* alert('strLen = [' + strLen + ']'); */

    if(orgStr == undefined || orgStr == "")
    {
        return orgStr;
    }
    else if(replaceChar == undefined || replaceChar == "")
    {
        return orgStr;
    }
    else if(strLen < strPos)
    {
        return orgStr;
    }
    else if(strLen < endPos)
    {
        return orgStr;
    }
    else if(strPos > endPos)
    {
        return orgStr;
    }

    chgStr = orgStr.substring(0, strPos);

    for(var idx = 0;idx < (endPos - strPos);idx++)
    {
        chgStr = chgStr + replaceChar;
    }

    chgStr = chgStr + orgStr.substring(endPos, strLen);
    return chgStr;
}
/**********************
* 이메일 합치기
*  ex : concatEmail('poo97', 'aaa.co.kr')
* @param : id
* @param : address
* @return : String 이메일주소
* @see
************************/
function concatEmail(id, address)
{
    if(id == "" || address == "")
    {
        return "";
    }
    var email = id+"@"+address;
    return email;
}

/**********************
* 이메일 나누기
*  ex : splitEmail('poo97@aaa.co.kr')
* @param : email address
* @return : Array  (poo97, aaa.co.kr)
* @see
************************/
function splitEmail(email)
{
    var emailArr = new Array(2);
    var atPos, emaillen;
    emaillen = email.length;

    /* 입력되는 이메일 값이 없거나 이메일의 길이가 5미만이면 에러발생 */
    if(email == "" && email.length < 4)
    {
        return "";
    }

    atPos = email.indexOf("@");

    emailArr[0] = email.substring(0, atPos);
    emailArr[1] = email.substring(atPos + 1, emaillen);


    return emailArr;

}
/**********************
* 전화번호 합치기
*  ex : concatPhoneNum('111','111','111', '')
*  ex : concatPhoneNum('111','111','111', '-')
* @param : num1, num2, num3, conatCharecter
* @return : String 전화번호
* @see
************************/
function concatPhoneNum(num1, num2, num3, hyphen)
{
    var phoneNum;
    if(num1 == "" || num2 == "" || num3 == "")
    {
        return "";
    }

    if(hyphen == "")
    {
        phoneNum = num1 + num2 + num3;
    }
    else
    {
        phoneNum = num1 + hyphen + num2 + hyphen + num3;
    }

    return phoneNum;
}
/**********************
* 전화번호 나누기
*  ex : splitPhoneNum('021113333')
*  ex : splitPhoneNum('0211113333')
*  ex : splitPhoneNum('0512223333')
*  ex : splitPhoneNum('05122223333')
* @param : phonenum 전화번호
* @return : Array  (지역번호, 국번, 전화번호)
* @see
************************/
function splitPhoneNum(phonenum)
{

/*
   2-3-4  9    9자리 타입
   2-4-4  10   10자리 A타입
   3-3-4  10   10자리 B타입
   3-4-4  11   11자리 타입
*/

    var phonelen = phonenum.length;
    var splitNum = new Array(3);

    if(phonenum == "")
    {
        return "";
    }


    if(phonelen < 9)
    {
        return "";
    }
    else if(phonelen == 9)
    {
        if(phonenum.substring(0, 2) == "02")
        {
            splitNum[0] = phonenum.substring(0, 2);
            splitNum[1] = phonenum.substring(2, 5);
            splitNum[2] = phonenum.substring(5, 9);
        }
    }
    else if(phonelen == 10)
    {
        if(phonenum.substring(0, 2) == "02")
        {
            splitNum[0] = phonenum.substring(0, 2);
            splitNum[1] = phonenum.substring(2, 6);
            splitNum[2] = phonenum.substring(6, 10);
        }
        else
        {
            splitNum[0] = phonenum.substring(0, 3);
            splitNum[1] = phonenum.substring(3, 6);
            splitNum[2] = phonenum.substring(6, 10);
        }
    }
    else if(phonelen == 11)
    {
        splitNum[0] = phonenum.substring(0, 3);
        splitNum[1] = phonenum.substring(3, 7);
        splitNum[2] = phonenum.substring(7, 11);
    }


    return splitNum;
}


/**********************
* 주민번호 나누기
*  ex : splitSsn('7901112103456')
*  ex : splitSsn('790111-2103456')
* @param : ssn 주민번호
* @return : Array  (생년월일,주민번호)
* @see
************************/
function splitSsn(ssn)
{
    var ssnLen = ssn.length;
    var splitSsn = new Array(2);
    var chgSsn;

    if(ssn == "")
    {
        return "";
    }
    else if(ssnLen < 13 || ssnLen > 14)
    {
        return "";
    }

    if(ssnLen == 13)
    {
        splitSsn[0] = ssn.substring(0,6);
        splitSsn[1] = ssn.substring(6,13);
    }

    if(ssnLen == 14)
    {
        splitSsn[0] = ssn.substring(0,6);
        splitSsn[1] = ssn.substring(7,14);
    }

    return splitSsn;


}
/**********************
* 주민번호 합치기
*  ex : concatSsn('790111', '2103456', '-')
* @param : ssn1 주민번호앞 6자리
* @param : ssn2 주민번호뒤 7자리
* @return : str  '-'가 포함된 주민번호
* @see
************************/
function concatSsn(ssn1, ssn2, hyphen)
{
    var ssnStr;
    if(ssn1 == "" || ssn2 == "")
    {
        return "";
    }

    if(hyphen == "")
    {
        ssnStr = ssn1 + ssn2;
    }
    else
    {
        ssnStr = ssn1 + hyphen + ssn2;
    }

    return ssnStr;
}

/**********************
* 카드번호 나누기
*  ex : splitCardNo('1111222233334444')
* @param : ssn 주민번호
* @return : Array  (생년월일,주민번호)
* @see
************************/
function splitCardNo(cardno)
{
    var cardnoLen = cardno.length;
    var splitCardNo = new Array(4);
    var chgcardNo;

    if(cardno == "")
    {
        return "";
    }
    else if(cardnoLen != 16)
    {
        return "";
    }

    splitCardNo[0] = cardno.substring(0,4);
    splitCardNo[1] = cardno.substring(4,8);
    splitCardNo[2] = cardno.substring(8,12);
    splitCardNo[3] = cardno.substring(12,16);

    return splitCardNo;

}
/**********************
* 카드번호 합치기
*  ex : concatCardNo('1111', '2222', '3333', '4444',  '-')
* @param : cardno1 카드번호 첫번째 4자리
* @param : cardno2 카드번호 두번째 4자리
* @param : cardno3 카드번호 세번째 4자리
* @param : cardno4 카드번호 네번째 4자리
* @return : str  '-'가 포함된 카드번호
* @see
************************/
function concatCardNo(cardno1, cardno2, cardno3, cardno4, hyphen)
{
    var cardnoStr;
    if(cardno1 == "" || cardno2 == "" || cardno3 == "" || cardno4 == "")
    {
        return "";
    }

    if(hyphen == "")
    {
        cardnoStr = cardno1 + cardno2 + cardno3 + cardno4;
    }
    else
    {
        cardnoStr = cardno1 + hyphen + cardno2 + hyphen + cardno3 + hyphen + cardno4;
    }

    return cardnoStr;
}

/**********************
* 전화번호 마스킹
*  ex : maskPhoneNum("022223333")
*  ex : maskPhoneNum("0512223333")
*  ex : maskPhoneNum("0112223333")
*  ex : maskPhoneNum("01122223333")
* @param : phoneNum 전화번호
* @return : str  '-'가 포함되고 전화번호 마지막 4자리가 마스킹된 전화번호
* @see
************************/
function maskPhoneNum(phoneNum)
{
    var phoneSplitNum = splitPhoneNum(phoneNum);

    if(phoneSplitNum[0] == "" || phoneSplitNum[1] == "")
    {
        return "";
    }

    return concatPhoneNum(phoneSplitNum[0], phoneSplitNum[1], '****', '-');
}


/**********************
* 이메일 마스킹
*  ex : maskEmail("poo@gmail.com")
*  ex : maskEmail("poo@gmail.com")
* @param : email 이메일
* @return : str  id의 앞자리 두자리를 뺀 나머지가 마스킹된 이메일
* @see
************************/
function maskEmail(email)
{
    var emailSplitStr;
    var emailIdLen;

    emailSplitStr = splitEmail(email);

    if(emailSplitStr[0] == "" || emailSplitStr[1] == "")
    {
        return "";
    }

    var emailIdLen = emailSplitStr[0].length;

    if(emailIdLen < 1)
    {
        return "";
    }

    var replaceEmailId = stringMask(emailSplitStr[0], 2, emailIdLen, '*');

    return concatEmail(replaceEmailId, emailSplitStr[1]);

}

/**********************
* 주민번호 마스킹
*  ex : maskSsn("7901141105719")
* @param : ssn 주민번호
* @return : str  주민번호에 '-'가 포함되고 뒷자리 7자리가 마스킹된 문자열
* @see
************************/
function maskSsn(ssn)
{
    var ssnSplitStr = splitSsn(ssn);

    if(ssnSplitStr[0] == "" || ssnSplitStr[1] == "")
    {
        return "";
    }

    return concatSsn(ssnSplitStr[0], '*******', '-');

}

/**********************
* 카드번호 마스킹
*  ex : maskCardNo("1111222233334444")
* @param : cardno 카드번호
* @return : str  카드번호에 '-'가 포함되고 세번째와 네번째 카드번호가 '*'로 마스킹된 함수
* @see
************************/
function maskCardNo(cardno)
{
    var cardnoSplitStr = splitCardNo(cardno);

    if(splitCardNo[0] == "" || splitCardNo[1] == "")
    {
        return "";
    }

    return concatCardNo(cardnoSplitStr[0], cardnoSplitStr[1], '****', '****', '-');

}

/**********************
* 글자 체크
*  ex : onKeyUp="textCheck(f.MG_YJUKY01);"
* @param : 글자 필드
* @return : boolean값
* @see
************************/
function textCheck(textField)
{
    if ( textField.value.indexOf(";") != -1 ) {
        i18nExtAlert(textCheck_str);
        textField.value = "";
        textField.focus();
        return false;
    }
}


/**********************
* 글자 카운팅
*  ex : onKeyUp="textCounter(f.MG_YJUKY01, 9); textCheck(f.MG_YJUKY01);"
* @param : theField 필드명
* @param : maxChars 최대글자수
* @return : boolean값
* @see
************************/
function textCounter(theField,maxChars)
{
    var stKoreanInputYn = false;
    var maxLength = maxChars * 2;
    for (var i = 0; i < theField.value.length; i++)
    {
        var charCode = theField.value.charCodeAt(i);

        if (charCode > 128) {/* 한글일 경우 */
            stKoreanInputYn = true;
        }

        if(stKoreanInputYn){
            if(theField.value.length > maxChars) {
            	theField.blur();
                i18nExtAlertFn(textCounter_str1 + maxChars+ textCounter_str2, '', textCounterSizeCut.createDelegate(this,[theField, maxChars],1), language);
/*                theField.value=theField.value.substring(0,maxLength);
                theField.focus();
                return false;*/
            }
        } else {
            if(theField.value.length > maxLength) {
            	theField.blur();
                i18nExtAlert(textCounter_str3 + maxLength + textCounter_str2, '', textCounterSizeCut.createDelegate(this,[theField, maxChars],1), language);
/*                theField.value=theField.value.substring(0,maxLength);
                theField.focus();
                return false;
*/
            }
        }
    }
}

/**********************
* 글자 카운팅 (textCounter에서 i18nExtAlertFn이 뜬 뒤에 실행되어야할 부분)
* @param : theField 필드명
* @param : maxChars 최대글자수
* @see
************************/
function textCounterSizeCut(btn, theField, maxChars)
{
	theField.value=theField.value.substring(0,maxChars);
    //theField.focus();
    theField.blur();
    return false;
}


/**********************
* '-' 입력값
*  ex : formatHyphen
* @param : theField 필드명
* @param : maxChars 최대글자수
* @return : 없음
* @see
************************/
function formatHyphen(tx) {
    var oldv = "";
    if(oldv == tx.value) return;
    oldv = tx.value;
    tx.value = (event.keyCode < 32 ) ? oldv : formatKebact(oldv);
}

/**********************
* function formatKebact(s) 계좌번호 입력시 외환은행 계좌형식으로 자동Setting
*  ex : formatKebact(s)
* @param : theField 필드명
* @return : string
* @see
************************/
function formatKebact(s){
    s=s.replace(/-|\//g,"");
    l=s.length;
    if ( l > 13 ) s = s.substr(0, 13);
    if (l < 3) {
        return s;
    }
    if (l == 3) {
        s=s+"-";
        return s;
    }


    if(s.substr(0, 1) == "6" || s.substr(0, 1) == "7" || s.substr(0, 1) == "8") {
        /* 차세대계좌번호 */
        if ((l >= 4) && (l < 10)) {
            s=s.substr(0,3)+"-"+s.substr(3,l-1);
            return s;
        }
        else if ((l >= 10) && (l < 13) ) {
            s=s.substr(0,3)+"-"+s.substr(3,6)+"-"+s.substr(9,l-1);
            return s;
        }
        else if( l == 13) {
            return s.substr(0,3)+'-'+s.substr(3,2)+'-'+s.substr(5,5)+'-'+s.substr(10,3);
        }
        else return s;

    } else {
        /* 현세대계좌번호 */
        if (l == 4) {
            s=s.substr(0,3)+"-"+s.substr(3,l-1);
            return s;
        }
        else if (l == 5) {
            s=s.substr(0,3)+"-"+s.substr(3,l-1)+"-";
            return s;
        }
        else if ((l >= 6) && (l < 10)) {
            s=s.substr(0,3)+"-"+s.substr(3,2)+"-"+s.substr(5,l-5);
            return s;
        }
        else if (l == 10) {
            s=s.substr(0,3)+"-"+s.substr(3,2)+"-"+s.substr(5,5)+"-";
            return s;
        }
        else if (l == 11) {
            s=s.substr(0,3)+"-"+s.substr(3,2)+"-"+s.substr(5,5)+"-"+s.substr(10,l-1);
            return s;
        }
        else if (l == 12) {
            s=s.substr(0,3)+"-"+s.substr(3,6)+"-"+s.substr(9,l-3);
            return s;
        }
        else if( l == 13) {
            return s.substr(0,3)+'-'+s.substr(3,2)+'-'+s.substr(5,5)+'-'+s.substr(10,3);
        }
        else return s;
    }
}

/**********************
* function onlyAcctNumber 계좌번호만 입력받음
*  ex : onlyAcctNumber()
* @param :
* @return : boolean
* @see
************************/
function onlyAcctNumber() {
    var re = /([^0-9])/;
    return CKKeyPro_Check(event.srcElement, re);

    var keyCode = event.keyCode ? event.keyCode :
            event.which ? event.which : event.charCode;
    if (keyCode != 13) {
        if( ( keyCode<47 || keyCode>57 ) && keyCode != 45 ) {
            event.returnValue = false;
        }
    }
}

/**********************
* function removeHyphen 날라갈때 하이픈 빼주기
*  ex : removeHyphen(obj)
* @param : 필드명
* @return : 없음
* @see
************************/
function removeHyphen(obj) {
    val = obj.value;

    str = "";
    strr = val.split("-");
    for (i=0;i<strr.length;i++){
        str += strr[i];
    }
    obj.value = str;
}

/**********************
* function formatComma 컴마 넣어줌
*  ex : formatComma(obj)
* @param : 필드명
* @return : 없음
* @see
************************/
function formatComma(tx) {              /* 컴마 삽입 */
    var oldv = "";
    if(oldv == tx.value) return;
    oldv = tx.value;
    tx.value = formatNumber(oldv);
}


/**********************
* function formatNumber(s) 자동으로 콤마 셋팅하기
*  ex : formatComma(obj)
* @param : 필드명
* @return : 컴마가 들어간 str
* @see
************************/
function formatNumber(s)
{
    var str  = s.replace(/\D/g,"");
        var len  = str.length;
        var tmp  = "";
        var tm2  = "";
        var i    = 0;
        while (str.charAt(i) == '0') i++;        //0만 입력되지 않게 하는 곳 삭제. 2003.01.08 신정섭
		if(str.length == i) return "0";
        str = str.substring(i,len);
        len = str.length;
        if(len < 3) {
            return str;
        }
    else {
            var sit = len % 3;
            if (sit > 0) {
                tmp = tmp + str.substring(0,sit) + ',';
                len = len - sit;
            }
            while (len > 3) {
                tmp = tmp + str.substring(sit,sit+3) + ',';
                len = len - 3;
                sit = sit + 3;
            }
            tmp = tmp + str.substring(sit,sit+3) + tm2;
            str = tmp;
        }
        return str;
}


/**********************
 * obj에 입력된 숫자를 targetId을 가진 Element의 값이나 innerText로 한글금액으로 바꾼다.
 * 반드시 keyup에 걸어야함.
 * @param obj - 입력받을 Element (보통 this가 된다.)
 * @param targetName - 한글금액을 보여줄 Tag
 * @param type - 없으면 원단위, 1이면 만단위, 2이면 10만단위
 * @return
 ***********************/
function putHanAmt(obj, targetId, type) {

	if(language != undefined && language != 'KO'){
		return;
	}

    var hanNumber = new Array('영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구');
    var fourFour = new Array('일', '만', '억', '조');
    var fourDigit = new Array('일', '십', '백', '천');

    var num = obj.value.replace(/\D/g, "");

    /*  한글금액 처리 */
    var delimiter = ' ';
    var endValue = '원';
    var endZValue = '영';

    var bPos = 0; /*  만, 억, 조 */
    var sPos = 0; /*  십, 백, 천 */
    var digit = 0;

    if (type == null) { /*  원단위 */
        bPos = 0; /*  만, 억, 조 */
        sPos = 0; /*  십, 백, 천 */
        endValue = "원";
        endZValue = '원';
    } else if (type == '1') { /*  만단위 */
        bPos = 1; /*  만, 억, 조 */
        sPos = 0; /*  십, 백, 천 */
        endValue = "원";
        endZValue = '영 만원';
    } else if (type == '2') { /*  십만단위 */
        bPos = 1; /*  만, 억, 조 */
        sPos = 1; /*  십, 백, 천 */
        endValue = "만 원";
        endZValue = '영 십만원';
    }

    var szDigit = '';
    var is_start = false;
    var appendFF = false;
    var len = num.length;
    var szHan = '';

    for (i = len - 1; i >= 0; i--) {
        szDigit = num.substring(i, i + 1);
        digit = parseInt(szDigit);

        if (digit != 0) {
            if (bPos != 0 && sPos == 0) {
                if (is_start == true)
                    szHan += delimiter;
                szHan += fourFour[bPos]; /*  만, 억 */
                appendFF = false;
            }
            if (bPos != 0 && appendFF == true) {
                if (is_start == true)
                    szHan += delimiter;
                szHan += fourFour[bPos]; /*  만, 억 */
                appendFF = false;
            }

            if (sPos != 0)
                szHan += fourDigit[sPos]; /*  십, 백, 천 */
            szHan += hanNumber[digit]; /*  일, 이, 삼 */
            is_start = true;

        } else if (sPos == 0 && bPos != 0)
            appendFF = true;
        sPos++;
        if (sPos % 4 == 0) {
            sPos = 0;
            bPos++;
            if (bPos >= 4) {
                return "(범위초과)";
            }
        }
    }

    var result = '';
    if (is_start == false) {
        result = endZValue;
    } else {
        for (i = szHan.length - 1; i >= 0; i--) {
            result += szHan.substring(i, i + 1);
        }
        result += endValue;
    }

    var targetEle = document.getElementById(targetId);
    if(targetEle.tagName == "input") {
        targetEle.value = result;
    } else {
        targetEle.innerText = result;
    }

    return result;
}
/**********************
* function hasOnlyNumDN 입력시 숫자만 받음
*  ex : hasOnlyNumDN()
* @param :
* @return : 없음
* @see
************************/
function hasOnlyNumDN() {
  var re = /([^0-9])/;
  return CKKeyPro_Check(event.srcElement, re);

  var code = event.keyCode ? event.keyCode :
          event.which ? event.which : event.charCode;
  if (code!=13) {
    event.returnValue =
      ( code >= 48 && code <= 57)     /*  Number */
      || code == 8                    /*  Backspace */
      || code == 9                    /*  Tab */
      || code == 46                   /*  Delete */
      || ( code >= 37 && code <= 40)  /*  Cursor Key */
      || ( code >= 96 && code <= 105) /*  Key Pad */
  }
}




/**********************
* 치환값을 변경함
* @param : 원본 값
* @param : 변경대상값
* @param : 치환값
* @return : 치환된 값이 적용된 스트링
* @see
************************/
function replaceAll(srcStr, targetStr, replaceStr)
{

    var newPattern = new RegExp(targetStr, "g");

    return srcStr.replace(newPattern, replaceStr);
}

/**********************
* 브라우저가 익스플로러가 아닌경우에 이전페이지로 돌아감
* @param :
* @return :
* @see
************************/
function goReturnPage()
{
    var NaviInfo = getNavigatorInfoStr();

    if(NaviInfo.indexOf("Explorer") < 0)
    {
        history.back();
    }
}



/**********************
* 년월일자에 '-'를 넣어주는 함수
* @param : yyyymmdd
* @return : yyyy-mm-dd
* @see
************************/
function inputDashDate(dateValue)
{
    if(dateValue != undefined && dateValue.length == 8)
    {
        return (dateValue.substring(0,4)+ "-" + dateValue.substring(4,6)+ "-" + dateValue.substring(6,8));
    }
    else
        return dateValue;
}



/**********************
* 년월일자에 '/'를 넣어주는 함수
* @param : yyyymmdd
* @return : yyyy/mm/dd
* @see
************************/
function inputSlashDate(dateValue)
{
    if(dateValue != undefined && dateValue.length == 8)
    {
        return (dateValue.substring(0,4)+ "/" + dateValue.substring(4,6)+ "/" + dateValue.substring(6,8));
    }
    else
        return dateValue;
}







