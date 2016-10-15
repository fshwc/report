var $j = jQuery.noConflict(); 
var commentingPager = {
	init : function() {
		commentingPager.queue() ;
		commentingPager.tipBtn() ;
		commentingPager.addRemarkBtn() ;
		commentingPager.stuList() ;
	} ,
	queue : function() {
		$j("#queue").click(function() {
			if($j(this).attr("data-val") == 0) {
				$j(this).html("按得分率由高到低排") ;
				$j(this).attr("data-val",1) ;
			}else if($j(this).attr("data-val") == 1) {
				$j(this).html("按得分率由低到高排") ;
				$j(this).attr("data-val",0);
			}
			
		})
	} ,

	//显示隐藏答题统计
	tipBtn : function() {
		for(var i=1;i<=$j('.tip').length;i++) {
			$j('#statistics_'+i).toggle(function() {
				$j(this).parent().next().show() ;
				$j(this).children(2).removeClass('icon-arrowbluedowm').addClass('icon-arrowblueup') ;
			},function() {
				$j(this).parent().next().hide() ;
				$j(this).children(2).removeClass('icon-arrowblueup').addClass('icon-arrowbluedowm') ;
			})
		}
	} ,

	//添加备注
	addRemarkBtn : function() {
		for(var i=1;i<=$j(".maintext").length;i++) {
			$j("#remarks_"+i).click(function(e) {
				$j("#remarks").css("display","block") ;
				$j("#black_box").css("display","block") ;
				e.stopPropagation() ;
				commentingPager.addRemark() ;
			})
		}
		$j(".closed").click(function() {
			$j("#remarks").css("display","none") ;
			$j("#black_box").css("display","none") ;
			$j("#student_list").css("display","none") ;
			
		})
	} ,

	addRemark : function() {
		$j(".add").click(function() {
			var txt = $j("#remarks textarea").val() ;
			//传到后台数据库中
			$j("#remarks textarea").val("") ;
			//从数据库拿数据
			$j("#remarks_list ul").append("<li>"+txt+"</li>") ;
		})
	} ,

    stuList : function() {
    	$j(".probleDetails div ul li a").click(function(e) {
    		var txt = $j(this).attr("data-txt") ;
    		//ajax
    		$j("#student_list").css("display","block") ;
			$j("#black_box").css("display","block") ;
			e.stopPropagation() ;
			commentingPager.addRemark() ;
    	})
    	
    }
	
}

$j(function() {
	commentingPager.init() ;
}) ;





