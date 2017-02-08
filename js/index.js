$(function() {
    var index = {
        init: function() {
            this.getSearchData();
            this.searchEvent();
            this.getSlideData();
            this.getIndexData();
            // this.dealFooterLinks();
        },
        data: {
            inputVal: [],
            mvData: {},
            hotData:[],
            linkData:[],
            searchData:{}
        },
        getSearchData: function() {
            var that = this;
            $.ajax({
                url: './json/search.json',
                type: 'get',
                data: {},
                success: function(res) {
                    console.log(res);
                    if (res.code == '0') {
                        var data = res.data.hotkey;
                        that.data.searchData = res.data;
                        that.dealDropList(data);
                    }
                },
                error: function() {

                }
            })
        },
        dealInputVal:function(){
        	var that = this;
        	for (var i = 0; i < 5; i++) {
                var searchVal = $('#searchInput').val();
                console.log(searchVal);
                if (that.data.inputVal.indexOf(searchVal) == -1) {
                    that.data.inputVal.push(searchVal);
                }
                searchVal = $('#searchInput').val('');
            }
            that.data.inputVal.reverse();
            console.log(that.data.inputVal);
            var searchStr = '';
            for (var i = 0; i < that.data.inputVal.length; i++) {
                var str = '<li class="list-item clearfix"><span class="item1">' + that.data.inputVal[i] + '</span><span class="item2"></span></li>'
                searchStr += str;
                console.log(searchStr);
            };
            $('.history-list').html(searchStr);
        },
        searchEvent: function() {
            var that = this;
            $('.search-item').on('click', '#searchInput', function(e) {
                e.stopPropagation();
                $('.search-drop').slideDown(200);
            });
            $('body').click(function(e) {
            	console.log(e.target);// 查看触发点击事件的元素
                $('.search-drop').slideUp(200);
            });
            // 点击搜索按钮
            $('#searchBtn').click(function(e) {
                e.stopPropagation();
                that.dealInputVal();
            });
            // 删除全部搜索记录
            $('#deleteUl').click(function(e) {
                e.stopPropagation();
                $('.history-list').html('');
                that.data.inputVal = [];
                $('#searchInput').click();
            });
            // 删除单挑搜索记录
            $('.history-list').on('click', 'span.item2', function(e) {
                e.stopPropagation();
                $(this).parent().remove();
                var val = $(this).prev().html();
                console.log(val)
                for (var i = 0; i < that.data.inputVal.length; i++) {
                    if (that.data.inputVal[i] == val) {
                        that.data.inputVal.splice(i, 1);
                    }
                }
                $('#searchInput').click();
            });
            $('.search-item').on('keyup',function(e){
            	if($('#searchInput').val() != '' && e.keyCode == 13){
            		console.log('13');
            		that.dealInputVal();
            	}else if($('#searchInput').val() == ''){
            		location.href = that.data.searchData.special_url;
            	}
            })
        },
        dealDropList: function(arr) {
            /*var randomArr = [];
            while( randomArr.length < 5 ){
            	var random = Math.floor( Math.random() * 30 );
            	if( randomArr.indexOf(random) ){
            		randomArr.push( random );
            	}
            }
            var liEle = '';
            for( var i = 0; i < randomArr.length; i++ ){
            	var num = ((arr[randomArr[i]].n)/10000).toFixed(1);
            	liEle += '<li class="list-item clearfix"><span class="item1">' + (i+1) + '</span><span class="item2">'+ arr[randomArr[i]].k +'</span><span class="item3">'+num+'万</span></li>';	
            }*/
            var liEle = '';
            for (var i = 0; i < 5; i++) {
                var num = ((arr[i].n) / 10000).toFixed(1)
                liEle += '<li class="list-item clearfix"><span class="item1">' + (i + 1) + '</span><span class="item2">' + arr[i].k + '</span><span class="item3">' + num + '万</span></li>';
            }
            $('.drop-list').html(liEle);
        },
        getSlideData: function() {
            var that = this;
            $.ajax({
                url: './json/slide.json',
                type: 'get',
                data: {},
                success: function(res) {
                    if (res.code == '0') {
                        console.log(res);
                        that.dealSlide(res.data);
                    } else {
                        alert(res.error);
                    }
                }
            })
        },
        dealSlide: function(data) {
            var lihtml = $('#liEle').html();
            var lihtmlFn = _.template(lihtml);
            var liEleStr = lihtmlFn({
                liData: data
            });
            $('#slide-list').append(liEleStr);
            var showIndex = 0;
            var timer = setInterval(showImg, 1800);

            function showImg() {
                showIndex++;
                $('#pointers>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#slide-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400, function() {
                    if (showIndex == 3) {
                        showIndex = 0;
                        $('#pointers>span').eq(0).addClass('active').siblings().removeClass('active');
                        $('#slide-list').css({
                            left: 0
                        });
                    };
                });
            };
            $('#leftItem').on('click', function() {
                clearInterval(timer);
                showIndex--;
                // 归零处理 当showIndex<0时,应显示第三帧图片
                if (showIndex < 0) {
                    showIndex = 2;
                    $('#slide-list').css({
                        left: -1200 * 3 + 'px'
                    });
                }
                $('#pointers>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#slide-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400);
                // 重写定时器
                timer = setInterval(showImg, 1800);
            });
            $('#slide-list li').hover(function(){
            	clearInterval(timer);
            },function(){
            	timer = setInterval(showImg, 1800);
            })
            $('#rightItem').on('click', function() {
            	clearInterval(timer);
            	showImg();
            	timer = setInterval(showImg, 1800);
            });
            $('#pointers').on('click','span',function(){
            	clearInterval(timer);
            	console.log($(this).index())
            	$(this).addClass('active').siblings().removeClass('active');
            	showIndex = $(this).index();
            	$('#pointers>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#slide-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400);
                timer = setInterval(showImg,1800);
            })
        },
        getIndexData:function(){
        	var that = this;
        	$.ajax({
        		url:'./json/index.json',
        		type:'get',
        		data:{},
        		success:function(res){
        			console.log(res);
        			console.log(res.data.toplist);
        			if(res.code == '0'){
        				// 排行榜数据
	        			var liHtml = $('#charts').html();
	        			var lihtmlFn = _.template(liHtml);
	        			var liStr = lihtmlFn({
	        				outerLi:res.data.toplist
	        			});
	        			$('#charts-list').html(liStr);
	        			// 热门数据
	        			that.data.hotData = res.data.hotdiss.list;
	        			var hotArr = that.data.hotData;
	        			Array.prototype.push.apply(hotArr,hotArr.slice(0,4) )
	        			console.log('热门数据',hotArr);
	        			that.dealHot(hotArr);
	        			// MV-首播数据
	        			that.data.mvData = res.data.shoubomv;
	        			console.log('MVdata数据',that.data.mvData)
	        			that.dealMV('all');
        			}
        		}
        	})
        },
        dealHot: function(data) {
            console.log(data);
            var hotHtml = $('#hotLi').html();
            var hotFn = _.template(hotHtml);
            var hotStr = hotFn({
                hotData: data
            });
            $('#hot-list').append(hotStr);

            var showIndex = 0;
            var timer = setInterval(showImg, 1800);

            function showImg() {
                showIndex++;
                $('#chart-pointer>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#hot #hot-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400, function() {
                    if (showIndex == 3) {
                        showIndex = 0;
                        $('#chart-pointer>span').eq(0).addClass('active').siblings().removeClass('active');
                        $('#hot #hot-list').css({
                            left: 0
                        });
                    };
                });
            };
            $('#left-btn').on('click', function() {
                clearInterval(timer);
                showIndex--;
                // 归零处理 当showIndex<0时,应显示第三帧图片
                if (showIndex < 0) {
                    showIndex = 2;
                    $('#hot #hot-list').css({
                        left: -1200 * 3 + 'px'
                    });
                }
                $('#chart-pointer>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#hot #hot-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400);
                // 重写定时器
                timer = setInterval(showImg, 1800);
            });
            $('#hot-list li').hover(function(){
            	clearInterval(timer);
            },function(){
            	timer = setInterval(showImg, 1800);
            })
            $('#right-btn').on('click', function() {
            	clearInterval(timer);
            	showImg();
            	timer = setInterval(showImg, 1800);
            });
            $('#chart-pointer').on('click','span',function(){
            	clearInterval(timer);
            	console.log($(this).index())
            	$(this).addClass('active').siblings().removeClass('active');
            	showIndex = $(this).index();
            	$('#chart-pointer>span').eq(showIndex).addClass('active').siblings().removeClass('active');
                $('#hot #hot-list').stop(true, true).animate({
                    left: -1200 * showIndex + 'px'
                }, 400);
                timer = setInterval(showImg,1800);
            })
        },
        dealMV:function(type){
        	var that = this;
        	var MVhtml = $('#MV-list').html();
			var MVfn = _.template(MVhtml);
			var MVStr = MVfn({
				MVData:that.data.mvData[type]
			});
			$('#MVList').html(MVStr);
			$('.nav-MV').on('click','li',function(){
				MVType = $(this).data('type');
	        	MVhtml = $('#MV-list').html();
				MVfn = _.template(MVhtml);
			    MVStr = MVfn({
					MVData:that.data.mvData[MVType]
				});
				$('#MVList').html(MVStr);
			})
        },
        // dealFooterLinks:function(){
        // 	var linkArr = ['CJ E&M','腾讯视频','手机QQ空间','最新版QQ','腾讯社交广告','电脑管家','QQ浏览器','画报','黄钻活动','星钻','腾讯微云','更多']
        // 	this.data.linkData = linkArr;
        // 	var linkHtml = $('#link').html();
        // 	var linkFn = _.template(linkHtml);
        // 	var str = linkFn({
        // 		links:this.data.linkData
        // 	})
        // 	$('#footer-link').append(str);
        // }
    }
    index.init()
})
