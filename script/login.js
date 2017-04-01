$(function () {
    var app = {
        init: function () {
            this.logIn(); // 登陆
        },
        logIn:function () {
            var storage = window.localStorage;
            var userInfo = JSON.parse(storage.getItem('user'));
            $('#logInBtn').click(function () {
                var userInfoArr = [];
                for (var i in userInfo) {
                    userInfoArr.push(i);
                }
                if (!storage.getItem('user')) {
                    $.notify({
                        // options
                        message: '请先注册'
                    },{
                        // settings
                        type: 'warning',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                    });
                }
                for (var i in userInfo) {
                    if ($('.userName').val() == i && $('.userPassword').val() == userInfo[i]) {
                        setTimeout(function () {
                            window.location.href = 'index.html';
                        },2000);
                        $.notify({
                            // options
                            message: '欢迎您 '+$('.userName').val()+' 正在为您跳转到首页'
                        },{
                            // settings
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "center"
                            },
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            },
                        });
                        
                        //存储用户名
                        storage.setItem('userName',$('.userName').val());
                        
                        return false;
                    }


                    if (userInfoArr.indexOf($('.userName').val()) == -1) {
                        $.notify({
                            // options
                            message: '用户名或密码错误'
                        },{
                            // settings
                            type: 'warning',
                            placement: {
                                from: "top",
                                align: "center"
                            },
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            },
                        });
                        return false
                    }
                    if ($('.userPassword').val() != userInfo[i]) {
                        $.notify({
                            // options
                            message: '用户名或密码错误'
                        },{
                            // settings
                            type: 'warning',
                            placement: {
                                from: "top",
                                align: "center"
                            },
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            },
                        });
                        return false
                    }
                }
            })
        },
        indexHTML: function () {

        }
    };
    app.init();
})