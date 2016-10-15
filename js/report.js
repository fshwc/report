var report = {

	classList : new Array(),
	//ExamID : examId,
	mycharts1 : echarts.init(document.getElementById("echarts_1")),
	mycharts2 : echarts.init(document.getElementById("echarts_2")),
	mycharts3 : echarts.init(document.getElementById("echarts_3")),
	isFirst : true,

	init : function() {
		report.echarts();
		report.btnGroup();
		report.setAvgEcharts();
		report.classLine();
		report.critical();
		report.sectionOk();
	},


	echarts : function() {	     	
		var option = {
			color : [ '#f87b5e', '#64f09f' ],
			tooltip : {
				trigger : 'item'
			},
			xAxis : [ {
				type : 'category',
				show : true,
				axisLabel : {
					rotate : 45,
					interval : 0
				},
				data : []
			} ],
			yAxis : [ {
				type : 'value'
			} ],
			series : [ {
				name : '平均分',
				type : 'bar',
				barWidth : 20,
				data : [],
				markLine : {
					data : [ {
						type : 'average',
						name : '校平均值'
					} ]
				}
			} ]
		};
		report.mycharts1.setOption(option);
		report.AvgEcharts();
		report.sectionEcharts(typeId);	
	},

	/*各科目班级平均分及排名*/
	AvgEcharts : function(subject) {
		var subjectKey = "";
		if(arguments.length == 0) {
			subjectKey = "totalScores";
		}else {
			subjectKey = subject;
		}
		/*$.ajax({
			type : 'GET',
			url : '',
			data : {
				examId : report.ExamID,
				subjectKey : subjectKey
			},
			success : function(data) {*/
				//var data = data.attributes.classAvg;
				var data = avg.attributes.classAvg;
				var sourceList = new Array();
				var classId = new Array();
				report.classList = [];
				$(data).each(function(i) {
					sourceList[i] = parseFloat(data[i].avgScore).toFixed(2);
					report.classList[i] = data[i].className;
					classId[i] = data[i].classId;
				});
				report.mycharts1.setOption({
					xAxis : {
						data : report.classList
					},
					series : [ {
						// 根据名字对应到相应的系列
						name : '平均分',
						data : sourceList
					} ]
				})
				report.setClassList("choose_class_ul","btn_avg_",report.classList);
				report.angBtn();
				report.avgGood(sourceList,report.classList);
				if(report.isFirst) {		
					report.subClassLine(report.classList,classId);						
					report.subjectEcharts(classId[0]);
					report.isFirst = false;
				}
			/*},
			error : function() {
			}
		});*/
	},

	avgGood:function(avgArr,claList) {
		var list = [];
        for(var z = 0; z < claList.length;z++) {
            list[z] = claList[z];
        }
        var numElements = avgArr.length;
        for(var outer = numElements; outer >= 2; --outer) {
            for(var inner = 0; inner <= outer - 1; ++inner) {
                if(avgArr[inner] > avgArr[inner + 1]) {
                    report.swap(avgArr,list,inner,inner + 1);
                }
            }
        }
        report.print(list);
    },
    
    swap:function (arr,cla,index1,index2) {
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        var temp2 = cla[index1];
        cla[index1] = cla[index2];
        cla[index2] = temp2;
    },

  	print:function (arr) {
        var str1 = "";
        var i = 0;
        while(i < 3) {
            str1 += arr[i] + " ";
            i++;
        }
        var j = 0;
        var str2 = "";
        arr.reverse();
        while(j < 3) {
            str2 += arr[j] + " ";
            j++;
        }
        $("#goodclass").html(str2);
        $("#badclass").html(str1);
   	},

	setAvgEcharts : function() {
		$("#total_score_ul li a").click(function() {
			report.AvgEcharts($(this).attr("data-index"));
			$("#total_score .subName").html($(this).html());
			$("#total_score_ul li a").removeClass("choosed");
			$(this).addClass("choosed");
			$("#choose_class_ul li a").removeClass("choosed");
			$("#btn_avg_0").click();
			$("#choose_class_ul").hide();
			
		})
	},

	/*各班级优劣势学科对比*/
	subjectEcharts : function(claId) {
		/*$.ajax({
			url : '',
			type : "GET" ,
			data : {
				examId : report.ExamID,
				classId : claId
			},
			success : function(data) {*/
				//var data = data.attributes.StandardScore;
				var data = standard.attributes.StandardScore;
				var txt = [];
				var num = [];
				var good = [];
				var bad = [];
				$(data).each(function(i) {
					var obj = {};
					obj.text = data[i].key;
					obj.max = 5 ;
					txt.push(obj);
					if(parseFloat(data[i].name)<0) {
						bad.push(data[i].key);  
					}else if(parseFloat(data[i].name)>=0) {
						good.push(data[i].key);
					}
					num[i] = (3+parseFloat(data[i].name)).toFixed(2);
				});
				report.mycharts3.setOption({
		    		polar : [
		        		{
		            	indicator : txt,
		            	shape: 'circle' ,
		            	splitLine: {
				            lineStyle: {
				                color: '#ccc'
				            }
				        },
				        splitArea: {
				            show: false
				        },
				        axisLine: {
				            lineStyle: {
				                color: '#666'
				            }
				        },
			       		}
			    	],
			    	series : [
			        {
			            name: '学科对比',
			            type: 'radar',
			            symbolSize :0,
			            data : [
			                {
			                	itemStyle: {
					                normal: {
					                	lineStyle:{
							            	color:'#64f09f'
							            },
					                    areaStyle: {
					                        color : '#64f09f'
					                    }
					                },
					                emphasis : {
					                	lineStyle:{
							            	color:'rgba(100,240,159,0.5)'
							            },
					                	areaStyle : {
					                		color:'rgba(100,240,159,0.5)'
					                	}
					                }
					            },
			                    value : [3,3,3,3,3,3,3,3,3,3],
			                    name : '标准'
			                },
			                {
			                	itemStyle: {
					                normal: {
					                	lineStyle:{
							            	color:'#f87b5e'
							            },
					                    areaStyle: {
					                         color : '#f87b5e'
					                    }
					                }
					            },
			                    value : num,
			                    name : '班级'
			                }
			            ]
			        }
		    		]
				});
				report.subGood(good,bad);
			/*}
		});	*/	
	},

	/*优劣势科目框*/
	subGood : function(goodList,badList) {
		if(goodList.length == 0) {
			$("#boodsubject").html("<span>优势科目</span>无优秀科目");
		}else {
			$("#boodsubject").html("<span>优势科目</span>"+goodList.join(","));
		}
		if(badList.length == 0) {
			$("#badsubject").html("<span>劣势学科</span>无劣势学科");
		}else {
			$("#badsubject").html("<span>劣势学科</span>"+badList.join(","));
		}
	},

	subClassLine : function(claList,idList) {
		var $ul = $("#strength_ul");
		var str = "<li><a href='javascript:void(0);' data-index='" + idList[0] + "' class='choosed'>"+claList[0]+"</a></li>";
		for(var i=1;i<claList.length;i++) {
			str += "<li><a href='javascript:void(0);' data-index='"+ idList[i] + "'>"+claList[i]+"</a></li>";
		};
		$("#goodClaName").html(claList[0]);
		$ul.html(str);
		$("#strength_ul li a").on("click",function() {
			var claId = $(this).attr("data-index");
			$("#goodClaName").html($(this).html());
			$("#strength_ul li a").removeClass("choosed");
			$(this).addClass("choosed");
			report.subjectEcharts(claId);
		});
	},

	/*班级总分分数段对比*/
	sectionEcharts : function(tId) {
		/*$.ajax({
			type : 'GET',
			url : '',
			data : {
				examId : report.ExamID,
				section : $("#sectionNum").val() ,
				typeId : tId
			},
			success : function(data) {*/
				//var data = data.attributes.SectionRankRate;
				var data = sec.attributes.SectionRankRate;
				var y = [];
				var claList = [];
				$(data).each(function(i) {
					var obj = {};
					obj.name = data[i].className;
					obj.type = "line";
					obj.data = data[i].yAxis;
					y.push(obj) ;
					claList[i] = data[i].className;
				});
				report.mycharts2.clear();
				report.mycharts2.setOption({
					color : [ '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
					'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
					'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
					'#00CD00','#4EEE94','#6A5ACD','#7D26CD','#8B1A1A',
					'#8B4789','#228B22','#8B8B00','#CD96CD','#EE00EE'],
					tooltip : {
						trigger : 'item',
						formatter : "{a}<br/>{b}区间的人数:{c}<br/>"
					},
					calculable : true,
					dataZoom : {
						show : true,
						start : 10,
						end : 90,
						dataBackgroundColor : '#42aa44'
					},
					xAxis : [ {
						type : 'category',
						show : true,
						boundaryGap : false,
						data : data[0].xAxis
					}],
					yAxis : [ {
						type : 'value'
					} ],
					series : y
				});
				report.setClassList("garde_section_ul","btn_total_",claList);
				report.totalBtn();
			/*},
			error : function(){}
		});*/
	},

	setClassList : function(ul,s,classL) {
		var $ul = $("#"+ul);
		var str = "<li><a href='javascript:void(0);' class='choosed' data-index='0' id='"+s+"0'>全部</a></li>";
		for (var i = 1; i <= classL.length; i++) {
			str += "<li><a href='javascript:void(0);' data-index='"+i+"' id='"+s+i+"'>" + classL[i-1] + "</a></li>";
		}
		$ul.html(str);
	},

	btnGroup : function() {
		$('#total_score').click(function(e) {
			$('#total_score_ul').toggle();
			e.stopPropagation();
		});
		$('#choose_class').click(function(e) {
			$('#choose_class_ul').toggle();
			e.stopPropagation();
		});
		$('#garde_section').click(function(e) {
			$('#garde_section ul').toggle();
			e.stopPropagation();
		});
		$('#strength').click(function(e) {
			$('#strength ul').toggle();
			e.stopPropagation();
		});
		$('#good').click(function(e) {
			$('#good ul').toggle();
			e.stopPropagation();
		});
		$(document).click(function() {
			$('#total_score_ul').css("display", "none");
			$('#choose_class_ul').css("display", "none");
			$('#garde_section ul').css("display", "none");
			$('#strength ul').css("display", "none");
			$('#good ul').css("display", "none");
		});
		$("#critical a").click(function() {
			$("#critical ul").toggle();
		});
		$("#top_switch a").click(function() {
			$("#top_switch ul").toggle();
		});
	},

	/* 总分 */
	totalBtn : function() {
		var colList = [ '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
						'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
						'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
						'#00CD00','#4EEE94','#6A5ACD','#7D26CD','#8B1A1A',
						'#8B4789','#228B22','#8B8B00','#CD96CD','#EE00EE'];
		report.setAttr("#btn_total_", $("#garde_section_ul li").length,
				colList, report.mycharts2, "line");
	},

	/* 平均分 */
	angBtn : function() {
		var colList = new Array();
		for (var i = 0; i < $("#choose_class_ul li").length; i++) {
			colList[i] = "#f87b5e";
		}
		report.setAttr("#btn_avg_", $("#choose_class_ul li").length, colList,
				report.mycharts1, "bar");
	},

	setAttr : function(string, len, colList, echart, type) {
		var echa = new Array();
		for (var i = 0; i < len; i++) {
			echa[i] = "rgba(255,255,0,0)";
			$(string + i).attr("flag", "hide");
			var all = true;
			$(string + i).on("click",function() {				
				$(this).toggleClass("choosed");
				var index = $(this).attr("data-index");
				if (index == 0) {
					for (var j = 0; j < len; j++) {
						echa[j] = colList[j];
						$(string + j).attr("flag", "hide");
						$(string + j).removeClass("choosed");
					}
					$(string + 0).addClass("choosed");
					all = true;
				} else {
					if (all) {
						$(string + 0).removeClass("choosed");
						for (var j = 0; j < len; j++) {
							echa[j] = "rgba(255,255,0,0)";
						}
						all = false;
					}
					if ($(this).attr("flag") == "hide") {
						echa[index - 1] = colList[index - 1];
						$(this).attr("flag", "show");
					} else if ($(this).attr("flag") == "show") {
						echa[index - 1] = "rgba(255,255,0,0)";
						$(this).attr("flag", "hide");
					}
				}
				report.setEchart(echart, echa, type);
			})
		}
	},

	setEchart : function(echart, echa, type) {
		if (type == "line") {
			echart.setOption({
				color : echa
			});
		} else if (type == "bar") {
			echart.setOption({
				series : [ {
					itemStyle : {
						normal : {
							color : function(params) {
								var colorList = echa;
								return colorList[params.dataIndex]
							}
						}
					}
				} ]
			})
		}
	},

	/*各班级达线人数统计表格*/
	classLine : function() {	
		//	切换文理
		if($("#classLine a").length==2) {
			$("#classLine a").click(function() {
				$("#classLine a").removeClass("act");
				$(this).addClass("act");
				$("#topCountOk").click();
			})
		}
		$("#topCountOk").click(function() {
			var num = $("#topCount").val();
			var tId = typeId;
			var $table = $(this).parent().parent().next();
			if(tId==3) {
				tId = $("#classLine .act").attr("data-value");
			};
			$.ajax({
				url : '',
				type : 'GET' ,
				data : {
					examId : report.ExamID,
					typeId : tId,
					Ranking : num
				},
				success : function(data) {
					var data = data.attributes.topSchool;
					if(data == null ) {
						alert("输入参数有问题，请重新输入！")
					}				
					var tableTh = "<tr><td rowspan='2'></td>";
					var thnum ="" ;
					var tableBody = "";
					for(var i=0;i<data[0].xAxis.length;i++) {
						tableTh += "<th>" + data[0].xAxis[i] + "</th>";
						thnum += "<td>前"+num+"名</td>" ;
					}
					tableTh += "</tr>" + "<tr>" + thnum +"</tr>" ;
					$(data).each(function(i) {
						tableBody += "<tr><td>"+data[i].className + "</td>";
						for(var j=0;j<data[i].yAxis.length;j++) {
							tableBody += "<td>" + data[i].yAxis[j]+"</td>";
						}
						tableBody += "</tr>";
					}) ;
					$table.html("<table>"+tableTh+tableBody+"</table>") ;
				},
				error : function() {}
			}) ;
		}) ;
	},

	/*临界生统计表格*/
	critical : function() {
		if($("#criticala a").length==2) {
			$("#criticala a").click(function() {
				$("#criticala a").removeClass("act");
				$(this).addClass("act");
				$("#criticalBtn").click();
			})
		}
		$("#criticalBtn").click(function() {
			var begin = $("#beginnum").val();
			var end = $("#endnum").val();	
			var tId = typeId;
			var $table = $(this).parent().parent().next();
			if(typeId==3) {
				tId = $("#criticala .act").attr("data-value");
			};
			$.ajax({
				url : '',
				type : 'GET' ,
				data : {
					examId : report.ExamID,
					typeId : tId,
					end : end,
					begin : begin
				},
				success : function(data) {
					var data = data.attributes.SectionRankRate;
					if(data == null) {
						alert("输入参数有问题或超出考试人数，请重新输入！");
						return false;
					} 
					
					var tableTh = "<tr><td rowspan='2'></td>";
					var thnum ="" ;
					var tableBody = "";
					for(var i=0;i<data[0].xAxis.length;i++) {
						tableTh += "<th colspan='2'>" + data[0].xAxis[i] + "</th>";
						thnum += "<td>人数</td><td>占比</td>" ;
					}
					tableTh += "</tr>" + "<tr>" + thnum +"</tr>" ;
					$(data).each(function(i) {
						tableBody += "<tr><td>"+data[i].className + "</td>";
						for(var j=0;j<data[i].yAxis.length;j++) {
							tableBody += "<td>" + data[i].yAxis[j]+"</td>";
						}
						tableBody += "</tr>";
					}) ;
					$table.html("<table>"+tableTh+tableBody+"</table>") ;
				},
				error : function() {}
			}) ;
		}) ;
	},

	/*班级总分分数段对比按钮*/
	sectionOk : function() {
		var tId = typeId;
		if($("#sectionSub a").length==2) {		
			if(typeId==3) {
				tId = $("#sectionSub .act").attr("data-value");
			};			
			$("#sectionSub a").click(function() {
				$("#sectionSub a").removeClass("act");
				$(this).addClass("act");
				tId = $("#sectionSub .act").attr("data-value");
				report.sectionEcharts($("#sectionSub .act").attr("data-value")) ;
			})
		}
		$("#sectionBtn").click(function() {
			report.sectionEcharts(tId) ;
		});
	} 
}
$(function() {
	report.init();
});




var avg = {"success":true,"msg":"操作成功","obj":null,"attributes":{"classAvg":[{"subjectName":null,"className":"458","classId":"4CEDC64D-A198-4B48-B607-5ACB42CFD1C8","avgScore":"570.125000"},{"subjectName":null,"className":"459","classId":"81331404-E465-417A-8719-497B234F9FE7","avgScore":"578.686567"},{"subjectName":null,"className":"460","classId":"667DFD57-EADE-461A-BCA3-2840F4A262F0","avgScore":"546.383333"},{"subjectName":null,"className":"461","classId":"3FA69369-3EF1-45AA-B2F9-E48049E247EC","avgScore":"557.500000"},{"subjectName":null,"className":"462","classId":"A3C818B7-4B3A-4FE7-8DFD-1B22B131BDC8","avgScore":"597.903225"},{"subjectName":null,"className":"463","classId":"645012EC-4C8A-40F5-8352-6C1CDDEBCEB3","avgScore":"559.968253"},{"subjectName":null,"className":"464","classId":"5EF50EAC-8484-4CC8-928B-029BA34E28F6","avgScore":"623.963768"},{"subjectName":null,"className":"465","classId":"4CC18E03-30D8-4056-91CC-A0DF9736B5F4","avgScore":"618.818840"},{"subjectName":null,"className":"466","classId":"676A45D0-8059-40F9-89D7-333139684EE6","avgScore":"635.823529"},{"subjectName":null,"className":"467","classId":"A6BF0988-1980-4CA6-A66A-9C45CEA1137B","avgScore":"636.881944"},{"subjectName":null,"className":"468","classId":"2D1B2CF4-0BED-4879-9BEC-9B215656B09E","avgScore":"774.823529"},{"subjectName":null,"className":"470","classId":"A11AF8D6-F05C-4136-9032-4800C386404A","avgScore":"646.190140"},{"subjectName":null,"className":"471","classId":"389356B1-788D-4E5A-A519-FF9B6418AEC3","avgScore":"643.793333"},{"subjectName":null,"className":"472","classId":"6BF523FA-8025-4AA0-B21E-1374CE35D690","avgScore":"649.935714"},{"subjectName":null,"className":"473","classId":"E49CD459-E118-4309-B112-90B559E65CEC","avgScore":"635.647887"},{"subjectName":null,"className":"474","classId":"54DFD705-663D-439D-8ABA-C9B85CDA805E","avgScore":"654.054794"},{"subjectName":null,"className":"475","classId":"2E23D1BB-62FA-418E-BC80-5417B4E121C2","avgScore":"640.669014"},{"subjectName":null,"className":"476","classId":"52A31901-024C-4285-9054-F1075E617138","avgScore":"646.195652"},{"subjectName":null,"className":"477","classId":"1AAF0683-5796-4F00-9E67-69FF4534ED06","avgScore":"631.112676"},{"subjectName":null,"className":"478","classId":"FEEE2C16-60A5-404E-9532-DAC718A8B4D6","avgScore":"626.457746"},{"subjectName":null,"className":"479","classId":"78197758-0175-4AF0-A6F5-AD2DD4256B67","avgScore":"632.143835"}]}}
var sec = {"success":true,"msg":"操作成功","obj":null,"attributes":{"SectionRankRate":[{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"464","yAxis":[1,0,0,0,0,2,0,0,2,2,5,12,13,14,13,3,2,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"465","yAxis":[0,0,0,0,0,0,0,0,1,4,12,10,13,18,9,2,0,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"466","yAxis":[0,0,0,0,0,0,0,0,0,6,6,11,13,17,8,5,2,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"467","yAxis":[0,0,0,0,0,0,0,0,1,6,5,11,18,15,8,6,2,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"468","yAxis":[0,0,0,0,0,0,0,0,0,0,0,0,2,6,14,19,22,4,1,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"470","yAxis":[0,0,0,0,0,0,0,1,0,0,8,13,16,14,11,5,1,2,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"471","yAxis":[1,0,0,0,0,0,0,1,1,0,4,17,9,19,15,8,0,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"472","yAxis":[1,0,0,0,0,0,0,0,0,3,5,9,14,16,13,5,3,1,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"473","yAxis":[1,1,0,0,0,0,0,0,2,4,5,8,11,16,13,8,2,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"474","yAxis":[0,0,0,0,0,0,0,0,0,3,4,15,12,13,17,6,3,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"475","yAxis":[0,0,0,0,0,0,1,0,0,4,5,11,18,16,10,2,1,3,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"476","yAxis":[0,0,0,0,0,0,0,0,2,2,7,14,11,10,12,8,3,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"477","yAxis":[1,0,0,0,0,0,0,0,1,7,4,11,13,17,8,7,2,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"478","yAxis":[0,0,0,0,0,0,0,0,0,7,8,11,21,9,8,3,4,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null},{"xAxis":["0-50","50-100","100-150","150-200","200-250","250-300","300-350","350-400","400-450","450-500","500-550","550-600","600-650","650-700","700-750","750-800","800-850","850-900","900-950","950-1000","1000-1050"],"className":"479","yAxis":[0,0,0,0,0,0,0,2,1,4,6,10,18,15,11,5,1,0,0,0,0],"rate":null,"wenList":null,"liList":null,"allList":null,"singleList":null}]}}
var standard = {"success":true,"msg":"操作成功","obj":null,"attributes":{"StandardScore":[{"key":"理地","name":"-0.07052691373746549","count":0},{"key":"理化","name":"0.949481339528116","count":0},{"key":"理历","name":"-0.12216635471929543","count":0},{"key":"理生","name":"-0.08591067962821908","count":0},{"key":"理数","name":"-0.04004990154638497","count":0},{"key":"理物","name":"-0.4963254596201178","count":0},{"key":"理政","name":"-0.4675716832449022","count":0},{"key":"英语","name":"-0.040436085502197835","count":0},{"key":"语文","name":"0.70262351049415","count":0}]}}
var typeId =  3;