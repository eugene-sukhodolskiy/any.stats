var url_parser={
    get_args: function (s) {
        var tmp=new Array();
        s=(s.toString()).split('&');
        for (var i in s) {
            i=s[i].split("=");
            tmp[(i[0])]=i[1];
        }
        return tmp;
    },
    
    get_args_cookie: function (s) {
        var tmp=new Array();
        s=(s.toString()).split('; ');
        for (var i in s) {
            i=s[i].split("=");
            tmp[(i[0])]=i[1];
        }
        return tmp;		
    }
};

var plugin_fb = {
    
    wwwref: false,
    
    callback: false,
    
    plugin_perms: "public_profile",

    auth: function (clientID) {
        if (!window.localStorage.getItem("plugin_fb_token") || window.localStorage.getItem("plugin_fb_perms")!=plugin_fb.plugin_perms) {
            var authURL="https://www.facebook.com/dialog/oauth?client_id="+clientID+"&scope="+this.plugin_perms+"&redirect_uri=https://www.facebook.com/connect/login_success.html&response_type=token";
            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
            this.wwwref.addEventListener('loadstop', this.auth_event_url);
        }
    },
    
    auth_event_url: function (event) {
        var tmp=(event.url).split("#");
        if (tmp[0]=='https://www.facebook.com/connect/login_success.html') {
            plugin_fb.wwwref.close();
            var tmp=url_parser.get_args(tmp[1]);
            if(!this.callback){
                window.localStorage.setItem("plugin_fb_token", tmp['access_token']);
                window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
                window.localStorage.setItem("plugin_fb_perms", plugin_fb.plugin_perms);
            }else{
                
                this.callback(tmp);
                
            }
        }

    }
};