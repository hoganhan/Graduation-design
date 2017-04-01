$(function () {
    var app = {
        init: function () {
            this.logInCorrelation();  // 登陆相关
            this.setFloor(); //设置楼层里的相关信息
            this.clickQuit();  // 点击退出
            this.addHref(); // 添加链接
        },
        logInCorrelation:function () {
            var storage = window.localStorage;
            if (storage.getItem('userName')) {
                $('.topBg a').css('display','none');
                $('.topBg strong').text('欢迎您,'+storage.getItem('userName'))
                    .css('display','block');
                $('.quit').css('display','block')
            }
        },
        setFloor: function () {

            $.ajax({
                url: 'script/commodityInformation.json',
                success: function (data) {
                    var num = 0;
                    $('.recommendBookWrap dd span').each(function () {
                        if (num  == 49) {
                            num = 0;
                        }
                        $(this).text(data[num].bookName);
                        num ++;
                    });

                    var num2 = 0;
                    $('.recommendBookWrap img').each(function () {
                        if (num2 == 49) {
                            num2 = 0;
                        }
                        $(this).attr('src',data[num2].smallImg);
                        num2 ++;
                    })

                    var num3 = 0;
                    $('.recommendBookWrap strong').each(function () {
                        if (num3 == 49) {
                            num3 = 0;
                        }
                        $(this).text(data[num3].cost);
                        num3 ++;
                    })

                    var num4 = 0;
                    $('.recommendBook .buyNow a').each(function () {
                        if (num4 == 49) {
                            num4 = 0;
                        }
                        var costN = data[num4].cost.split('.');
                        var cost1 = costN[0].split('');
                        var integer = cost1[1]+cost1[2];

                        var cost2 = costN[1].split('');

                        var decimals = cost2[0]+cost2[1];

                        var fullNum = integer + '.' + decimals;

                        $(this).attr('data-price',fullNum);
                        num4 ++;
                    })
                }
            })
        },
        clickQuit: function () {
            var storage = window.localStorage;
            $('.quit').click(function () {
                storage.removeItem('userName');
                window.location.href = 'index.html';
            })

        },
        addHref: function () {
            $('.boxNewBook').find('dt a').click(function () {
                $(this).attr('href','bookDetails.html')
            });
            $('.boxNewBook').find('dd span').click(function () {
                window.location.href = 'bookDetails.html';
            });

            $('.recommendBook').on('click','img', function () {
                window.location.href = 'bookDetails.html';
            });

            $('.recommendBook').on('click','span', function () {
                window.location.href = 'bookDetails.html';
            });

            $('.ranking').click(function () {
                window.location.href = 'bookDetails.html';
            });

            $('.navDiv').find('a:not(.index)').click(function () {
                window.location.href = 'category.html';
            });

            $('.cateListLittle a').click(function () {
                window.location.href = 'category.html';
            })
        }
    }
    app.init();
});