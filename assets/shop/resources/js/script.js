/* Author: Techbug Sep 14 2010
 * Flowerteam Global Javascript
 */


$(document).ready(function(){

    //캘린더표시(datepicker)
    $('input.datepicker').datepicker({
        showOn: 'button',
        dateFormat: 'yy/mm/dd',
        buttonImage: DOC.ROOT+'resources/img/inputdate.gif',
        buttonImageOnly: true
    });
    //캘린더표시(datepicker)
    $('input.monthpicker').datepicker({
        showOn: 'button',
        dateFormat: 'yy/mm',
        buttonImage: DOC.ROOT+'resources/img/inputdate.gif',
        buttonImageOnly: true
    });

    //Form Marks 및 validation check
    initializeHtmlPage();



    //combo박스 마우스 휠스크롤 막기(Ajax 호출방지) : nextutil.js
    var cmbObjs = document.getElementsByTagName('select');
    for(var i=0,len = cmbObjs.length; i < len ; i++){
        if(document.attachEvent){
            cmbObjs[i].attachEvent("onmousewheel", ignoreEvent );
        }else{
            cmbObjs[i].addEventListener("mousewheel", ignoreEvent , false);
        }
    }


    //이미지 lazy loading
    $("img.goodsimg").lazyload();
    $("img.eventimg").lazyload();

    //메인화면 슬라이더
	$("div.visual").faded({
		speed: 500,
		crossfade: true,
		autoplay: 3000,
		autorestart: 3000,
		autopagination:false
	});


	$("div.hori_visual").jcarousel({
		scroll:1,
		auto:4,
		wrap:"both",
		visible:1,
        buttonNextCallback: function(carousel) {
    	    $('div.next').bind('click', function() {
    	    	carousel.next();
    	        return false;
    	    });
        },
        buttonPrevCallback: function(carousel) {
    	    $('div.prev').bind('click', function() {
    	    	carousel.prev();
    	        return false;
    	    });
        },

        start: 1
	});

});




/**
 * 주문하기 화면 : 주문목록 보였다 안보였다 처리하기
 */
function toggleImageSet(){
    var $_handle = $("#ordlist_handle");
    var $_tip = $("#ordlist_handle_tip");
    var $_list =  $("#recent_orders");
    var $_cpoint = $("#ordlist_handle_wrapper");

    //목록 열렸을 경우 이미지셋팅
    if( true == $_list.is(":visible") ){
        $_handle.attr("src",DOC.ROOT+"resources/img/ordlist_close.gif");
        $_tip.attr("src",DOC.ROOT+"resources/img/tip_recentorder_close.png");
        $.cookie('techbug_order_display', 'show', { expires: 1, path: '/', domain: '', secure: false });
    }
    //목록 닫혔을 경우 이미지셋팅
    else {
        $_handle.attr("src",DOC.ROOT+"resources/img/ordlist_show.gif");
        $_tip.attr("src",DOC.ROOT+"resources/img/tip_recentorder_show.png");
        $.cookie('techbug_order_display', 'hide', { expires: 1, path: '/', domain: '', secure: false });
    }
}


/**
 * 숫자를 이미지로 바꾼다.
 */
function numberImgTrans(idx,str,imgDir){
	var tmpStr = str;
	var len = str.length;
	var imgPathStr;
	var htmlStr = "<span style='display:inline-block' >";
	for( var i=0; i < len ; i++){
		tmpStr = str.charAt(i)

		if(tmpStr==','){
			imgPathStr = "<img src="+ imgDir + "n_comma.gif border=0>"
		}else{
			imgPathStr = "<img src="+ imgDir + "n"+ tmpStr + ".gif border=0>"
		}
		htmlStr += imgPathStr;
	}
	$("#"+idx).html(htmlStr + "<span> 원</span>");
}

/**
 * loading indicator, block
 */
function loadingIndicator(idx){
  $(idx).addClass('cursorw');
  $(idx).block({message:'',css:{border:'0'},overlayCSS:{backgroundColor:'#FFF',opacity:'0.3'}});
}

/**
 * loading indicator, block 해제
 */
function completeLoading(idx){
  $(idx).removeClass('cursorw');
  $(idx).unblock();
}







/**
 * 팝업창 차단에 따라 뜨지 않는 것을 layer Pop-up 윈도우로 출력한다.
 * 반드시 jquery.BlockUI.js파일이 있어야 한다.
 * @see jquery.BlockUI.js
 * @author 김동완
 */
function layerPopup(title_img,include_html,w,h){
    if(title_img ==null || include_html ==null) {
        alert("타이틀 이미지와 해당 페이지를 찾을 수 없습니다.");
        return;
    }
    var colorStr = "#000000";
    var opacityStr = "0.4";
    var fullw = (w !=null && w !=undefined) ? w : 520;
    var fullh = (h !=null && h !=undefined) ? h : 380;
    var bifrmh = fullh - 50;
    var bifrmw = fullw - 2;
    var centerX = fullw/2;
    var centerY = fullh/2;

	$("body").unblock();
	var layerpop = ""
            +"<div class='layerpop' style='width:"+fullw+"px;height:"+fullh+"px'>"
            +"    <div class='layerhead'>"
            +"        <strong><img src='style/img/"+title_img+"' alt=' ' /></strong>"
            +"        <span title='닫기' onclick='closeLayerPopup()'>닫기</span>"
            +"    </div>"
            +"    <div class='layerbody' style='width:"+bifrmw+"px;height:"+bifrmh+"px'><iframe name='layerifrm' id='layerifrm' width='500' height='500' border='0' frameborder='0' class='layerifrm' style='width:"+bifrmw+"px;height:"+bifrmh+"px' src='"+include_html+"' /></iframe></div>"
            +"</div>";

	$("body").block({
	    message:layerpop,
	    css:{
	        'border':'0',
	        'position':'absolute',
	        'top':'50%',
	        'left':'50%',
	        'margin-top':'-'+centerY+'px',
	        'margin-left':'-'+centerX+'px'},
	    centerX:false,
	    centerY:false,
	    overlayCSS:{backgroundColor:colorStr,opacity:opacityStr}
	});

    //닫지 못할 경우를 대비하여 더블클릭했을경우 닫게 처리
    $(".blockOverlay").dblclick(function(caller){
        if(confirm("현재 보고 계신 팝업화면을 닫으시겠습니까?\n닫지 않으시려면 \"취소\" 버튼을 클릭해 주세요")){
            $("body").unblock();
        }
    });

	return;
}

/**
 * 레이어팝업닫기
 */
function closeLayerPopup(){
    $("body").unblock();
}

/**
 * iframe안의 레이어에서 바깥창을 닫을때 사용
 * 크롬브라우저는 로컬에서 parent.함수 호출이 function == undefined로 떨어짐.
 */
function parentCloseLayer(){
    if(parent !=null && parent.closeLayerPopup !=null ) {
        parent.closeLayerPopup();
    }else {
        closeLayerPopup();
    }
}



/**
 * percent-encoding
 * @param {strong}
 */
function pEncode(str){
	str = str.replace(/&amp;/g, "%26");
	str = str.replace(/[+]/g, "%2b");
	return str;
}
/**
 * 플래쉬 타이틀 생성하기 스크립트
 * @param {string} 플래쉬경로
 * @param {int} width
 * @param {int} height
 * @param {string} 화원명
 * @param {string} 클릭시 링크
 */
function showTitle(srcUrl, w, h, titleStr, linkStr){
    var htmlStr = ""
        + "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' "
        + "  codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' "
        + "  width='"+w+"' height='"+h+"' id='bloozonelogo' align='left'>"
        + "<param name='allowScriptAccess' value='always' />"
        + "<param name='movie' value='"+srcUrl+"' />"
        + "<param name='quality' value='high' />"
        + "<param name='menu' value='false' />"
        + "<param name='FlashVars' value='itemCnt=1&textvar1="+pEncode(titleStr)+"&mnuLink1="+linkStr+"' />"
        + "<param name='wmode' value='transparent' />"
        + "<param name='bgcolor' value='transparent' />"
        + "<embed src='"+srcUrl+"' quality='high' wmode='transparent' bgcolor='transparent' "
        + "     width='"+w+"' height='"+h+"' name='bloozonelogo' align='left' allowScriptAccess='always' "
        + "     FlashVars='itemCnt=1&textvar1="+pEncode(titleStr)+"&mnuLink1="+linkStr+"'"
        + "     type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />"
        + "</object>";
	document.write(htmlStr);
}







/*퀵메뉴 스크립트*/
var viewstart; // 위쪽 여백 (메뉴가 위에서 ''픽셀 떨어진 곳에 보여집니다)
var viewscroll = 30; // 스크롤시 브라우저 위쪽과 떨어지는 거리
var viewbottom = 80; // 스크롤시 마지막 바닥값
var quickbase = 350; // 스크롤 시작위치
var activatespeed = 10;
var scrollspeed = 20;

var quicktimer;
var quick_obj;

function refresh_quick(){
 var quickstartpoint;
 var quickendpoint;
 bottomlimit = document.documentElement.scrollHeight - viewbottom;
 quickstartpoint = parseInt(quick_obj.style.top, 10);
 quickendpoint = Math.max(document.documentElement.scrollTop, document.body.scrollTop) + viewscroll;
 if (quickendpoint < viewstart){
  quickendpoint = viewstart;
 }
 if (quickendpoint > bottomlimit){
  quickendpoint = bottomlimit;
 }
 if (quickstartpoint != quickendpoint){
  stmnScrollAmount = Math.ceil( Math.abs( quickendpoint - quickstartpoint ) / 15 );
  quick_obj.style.top = parseInt(quick_obj.style.top, 10) + ( ( quickendpoint < quickstartpoint ) ? -stmnScrollAmount : stmnScrollAmount ) + 'px';
 }
 quicktimer = setTimeout("refresh_quick();", activatespeed);
}
function initializequick(obj,left,starttop){
 quick_obj = document.getElementById(obj);
 viewstart = starttop;
 quick_obj.style.position = 'absolute';
 quick_obj.style.left = left + 'px';
 quick_obj.style.top = document.body.scrollTop + quickbase + 'px';
 refresh_quick();
}
function ScrollTop(){
 self.window.scroll(0,0);
}