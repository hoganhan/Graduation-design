$(function () {

    // 页面刷新时添加书籍
    var storage = window.localStorage;
    var userName = storage.getItem('userName');
    if (storage.getItem(userName)) {
        var bookNameArr = storage.getItem(userName).split(',');
        $.ajax({
            url: 'script/commodityInformation.json',
            success: function (data) {
                for (var i=0;i<bookNameArr.length;i++) {
                    for (var j in data) {
                        if (data[j].bookName == bookNameArr[i]) {
                            var costN = data[j].cost.split('.');
                            var cost1 = costN[0].split('');
                            var integer = cost1[1]+cost1[2];

                            var cost2 = costN[1].split('');

                            var decimals = cost2[0]+cost2[1];

                            var fullNum = parseFloat((integer + '.' + decimals)).toFixed(2);
                            var $ele = '<tr><td class="theBook">' +
                                       '<img src="'+data[j].smallImg+'"/>' +
                                       '<a href="#">'+data[j].bookName+'</a>' +
                                       '</td>' +
                                       '<td class="unitPrice">￥' +
                                       '<span>'+fullNum+'</span>元' +
                                       '<td class="adjustment">' +
                                       '<img src="images/minus.jpg" class="minus"/>' +
                                       '<input type="text" class="piece" value="1" /><img src="images/add.jpg" class="add" /></td><td class="totalPrices"><strong>￥<span>'+fullNum+'</span>元</strong></td><td class="operation"><a href="#" class="delCommodity">删除</a></td></tr>';
                            $('tbody').append($ele);
                        }
                    }
                }
                var totalValue = 0;
                var zongjia = []
                $('.totalPrices span').each(function (index) {
                    zongjia.push(Number($(this).text()));
                    totalValue += Number(zongjia[index]);
                })
                $('.closeAnAccount strong span').text(totalValue.toFixed(2))
            }
        });
    }
    $('.cartTable').on('click','.minus',function(){
        if ($(this).next().val() < 2) {
            $.notify({
                message: "不能再少啦！"
            },{
                element: 'body',
                type: 'warning',
                placement: {
                    from: "top",
                    align: "center"
                }
            })
        }else {
            //找到tr
            var $tr = $(this).parents('tr');
            $tr.find('.piece').val($tr.find('.piece').val() - 1);
            var unitPriceNum = parseFloat($tr.find('.unitPrice span').text()).toFixed(2);
            var totalPricesNum = unitPriceNum * $tr.find('.piece').val();
            $tr.find('.totalPrices strong span').text(totalPricesNum.toFixed(2))

            var totalPrice = 0;
            $('.totalPrices span').each(function () {
                totalPrice += parseFloat($(this).text());
            });
            $('.closeAnAccount strong span').text(totalPrice.toFixed(2));
        }
    });

    $('.cartTable').on('click','.add',function(){
        var $tr = $(this).parents('tr');
        $tr.find('.piece').val(parseFloat($tr.find('.piece').val()) + 1);
        var unitPriceNum = parseFloat($tr.find('.unitPrice span').text()).toFixed(2);
        var totalPricesNum = unitPriceNum * $tr.find('.piece').val();
        $tr.find('.totalPrices strong span').text(totalPricesNum.toFixed(2))

        var totalPrice = 0;
        $('.totalPrices span').each(function () {
            totalPrice += parseFloat($(this).text());
        });
        $('.closeAnAccount strong span').text(totalPrice.toFixed(2));

    });
    $('.cartTable').on('change','.piece',function(){
        console.log(isNaN($(this).val()))
        if (isNaN($(this).val())) {
            $.notify({
                message: "请填入数字！"
            },{
                element: 'body',
                type: 'warning',
                placement: {
                    from: "top",
                    align: "center"
                }
            });
            $(this).val(1);
        } else if ($(this).val() < 2) {
            $.notify({
                message: "不能再少啦！"
            },{
                element: 'body',
                type: 'warning',
                placement: {
                    from: "top",
                    align: "center"
                }
            });
            $(this).val(1);
        }
        var $tr = $(this).parents('tr');
        var unitPriceNum = parseFloat($tr.find('.unitPrice span').text()).toFixed(2);
        var totalPricesNum = unitPriceNum * $tr.find('.piece').val();
        $tr.find('.totalPrices strong span').text(totalPricesNum.toFixed(2));

        var totalPrice = 0;
        $('.totalPrices span').each(function () {
            totalPrice += parseFloat($(this).text());
        });
        $('.closeAnAccount strong span').text(totalPrice.toFixed(2));

    });

    //删除
    $('.cartTable').on('click','.delCommodity',function(){
        var $tr = $(this).parents('tr');
        swal({
                title: "你确定删除吗",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: '取消',
                closeOnConfirm: false
            },
            function(){
                swal("已删除", "", "success");
                $tr.remove();
                var totalPrice = 0;
                $('.totalPrices span').each(function () {
                    totalPrice += parseFloat($(this).text());
                });
                $('.closeAnAccount strong span').text(totalPrice.toFixed(2));
                var removeBookName = $tr.find('.theBook a').text();
                var bookName = storage.getItem(userName).split(',');
                for(var i = 0;i<bookName.length;i++) {
                    if (removeBookName == bookName[i]) {
                        bookName[i] = '';
                    }
                }
                var newBookName = '';
                for (var i=0;i<bookName.length;i++) {
                    if (!bookName[i] == '') {
                        if (newBookName == '') {
                            newBookName = bookName[i];
                        } else {
                            newBookName += ',' + bookName[i];
                        }
                    }
                }
                storage.setItem(userName,newBookName)
            });
    });
    var totalPrice = 0;
    $('.totalPrices span').each(function () {
        totalPrice += parseFloat($(this).text());
    });
    $('.closeAnAccount strong span').text(totalPrice.toFixed(2));

    //登录相关
    if (storage.getItem('userName')) {
        $('.topBg a').css('display','none');
        $('.topBg strong').text('欢迎您,'+storage.getItem('userName'))
            .css('display','block');
    }

    $('.quit').click(function () {
        storage.removeItem('userName');
        window.location.href = 'index.html';
    })

})
