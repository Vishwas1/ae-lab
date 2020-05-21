(function(h, J) {
    var x = function(m) {
        function p() {
            return "undefined" !== typeof b.authServerUrl ? "/" == b.authServerUrl.charAt(b.authServerUrl.length - 1) ? b.authServerUrl + "realms/" + encodeURIComponent(b.realm) : b.authServerUrl + "/realms/" + encodeURIComponent(b.realm) : J
        }

        function v(a, c) {
            function e(g, d, e, f) {
                y = (y + (new Date).getTime()) / 2;
                z(g, d, e, y);
                C && (b.tokenParsed && b.tokenParsed.nonce != a.storedNonce || b.refreshTokenParsed && b.refreshTokenParsed.nonce != a.storedNonce || b.idTokenParsed && b.idTokenParsed.nonce != a.storedNonce) ?
                    (console.info("[KEYCLOAK] Invalid nonce, clearing token"), b.clearToken(), c && c.setError()) : f && (b.onAuthSuccess && b.onAuthSuccess(), c && c.setSuccess())
            }
            var d = a.code,
                f = a.error,
                g = a.prompt,
                y = (new Date).getTime();
            if (f) "none" != g ? (d = {
                error: f,
                error_description: a.error_description
            }, b.onAuthError && b.onAuthError(d), c && c.setError(d)) : c && c.setSuccess();
            else if ("standard" != b.flow && (a.access_token || a.id_token) && e(a.access_token, null, a.id_token, !0), "implicit" != b.flow && d) {
                var d = "code\x3d" + d + "\x26grant_type\x3dauthorization_code",
                    f = b.endpoints.token(),
                    n = new XMLHttpRequest;
                n.open("POST", f, !0);
                n.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                b.clientId && b.clientSecret ? n.setRequestHeader("Authorization", "Basic " + btoa(b.clientId + ":" + b.clientSecret)) : d += "\x26client_id\x3d" + encodeURIComponent(b.clientId);
                d += "\x26redirect_uri\x3d" + a.redirectUri;
                n.withCredentials = !0;
                n.onreadystatechange = function() {
                    if (4 == n.readyState)
                        if (200 == n.status) {
                            var a = JSON.parse(n.responseText);
                            e(a.access_token, a.refresh_token, a.id_token,
                                "standard" === b.flow);
                            D()
                        } else b.onAuthError && b.onAuthError(), c && c.setError()
                };
                n.send(d)
            }
        }

        function M(a) {
            function c(a) {
                b.endpoints = a ? {
                    authorize: function() {
                        return a.authorization_endpoint
                    },
                    token: function() {
                        return a.token_endpoint
                    },
                    logout: function() {
                        if (!a.end_session_endpoint) throw "Not supported by the OIDC server";
                        return a.end_session_endpoint
                    },
                    checkSessionIframe: function() {
                        if (!a.check_session_iframe) throw "Not supported by the OIDC server";
                        return a.check_session_iframe
                    },
                    register: function() {
                        throw 'Redirection to "Register user" page not supported in standard OIDC mode';
                    },
                    userinfo: function() {
                        if (!a.userinfo_endpoint) throw "Not supported by the OIDC server";
                        return a.userinfo_endpoint
                    }
                } : {
                    authorize: function() {
                        return p() + "/protocol/openid-connect/auth"
                    },
                    token: function() {
                        return p() + "/protocol/openid-connect/token"
                    },
                    logout: function() {
                        return p() + "/protocol/openid-connect/logout"
                    },
                    checkSessionIframe: function() {
                        var a = p() + "/protocol/openid-connect/login-status-iframe.html";
                        b.iframeVersion && (a = a + "?version\x3d" + b.iframeVersion);
                        return a
                    },
                    register: function() {
                        return p() + "/protocol/openid-connect/registrations"
                    },
                    userinfo: function() {
                        return p() + "/protocol/openid-connect/userinfo"
                    }
                }
            }
            var e = l(!0),
                d;
            m ? "string" === typeof m && (d = m) : d = "keycloak.json";
            if (d) {
                var f = new XMLHttpRequest;
                f.open("GET", d, !0);
                f.setRequestHeader("Accept", "application/json");
                f.onreadystatechange = function() {
                    if (4 == f.readyState)
                        if (200 == f.status || 0 == f.status && f.responseText && f.responseURL.startsWith("file:")) {
                            var a = JSON.parse(f.responseText);
                            b.authServerUrl = a["auth-server-url"];
                            b.realm = a.realm;
                            b.clientId = a.resource;
                            b.clientSecret = (a.credentials || {}).secret;
                            c(null);
                            e.setSuccess()
                        } else e.setError()
                };
                f.send()
            } else {
                if (!m.clientId) throw "clientId missing";
                b.clientId = m.clientId;
                b.clientSecret = (m.credentials || {}).secret;
                if (a = m.oidcProvider) "string" === typeof a ? (a = "/" == a.charAt(a.length - 1) ? a + ".well-known/openid-configuration" : a + "/.well-known/openid-configuration", f = new XMLHttpRequest, f.open("GET", a, !0), f.setRequestHeader("Accept", "application/json"), f.onreadystatechange = function() {
                    if (4 == f.readyState)
                        if (200 == f.status || 0 == f.status && f.responseText && f.responseURL.startsWith("file:")) {
                            var a =
                                JSON.parse(f.responseText);
                            c(a);
                            e.setSuccess()
                        } else e.setError()
                }, f.send()) : (c(a), e.setSuccess());
                else {
                    if (!m.url)
                        for (a = document.getElementsByTagName("script"), d = 0; d < a.length; d++)
                            if (a[d].src.match(/.*keycloak\.js/)) {
                                m.url = a[d].src.substr(0, a[d].src.indexOf("/js/keycloak.js"));
                                break
                            }
                    if (!m.realm) throw "realm missing";
                    b.authServerUrl = m.url;
                    b.realm = m.realm;
                    c(null);
                    e.setSuccess()
                }
            }
            return e.promise
        }

        function z(a, c, e, d) {
            b.tokenTimeoutHandle && (clearTimeout(b.tokenTimeoutHandle), b.tokenTimeoutHandle = null);
            c ?
                (b.refreshToken = c, b.refreshTokenParsed = E(c)) : (delete b.refreshToken, delete b.refreshTokenParsed);
            e ? (b.idToken = e, b.idTokenParsed = E(e)) : (delete b.idToken, delete b.idTokenParsed);
            if (a) {
                if (b.token = a, b.tokenParsed = E(a), b.sessionId = b.tokenParsed.session_state, b.authenticated = !0, b.subject = b.tokenParsed.sub, b.realmAccess = b.tokenParsed.realm_access, b.resourceAccess = b.tokenParsed.resource_access, d && (b.timeSkew = Math.floor(d / 1E3) - b.tokenParsed.iat), null != b.timeSkew && (console.info("[KEYCLOAK] Estimated time difference between browser and server is " +
                        b.timeSkew + " seconds"), b.onTokenExpired))
                    if (a = 1E3 * (b.tokenParsed.exp - (new Date).getTime() / 1E3 + b.timeSkew), console.info("[KEYCLOAK] Token expires in " + Math.round(a / 1E3) + " s"), 0 >= a) b.onTokenExpired();
                    else b.tokenTimeoutHandle = setTimeout(b.onTokenExpired, a)
            } else delete b.token, delete b.tokenParsed, delete b.subject, delete b.realmAccess, delete b.resourceAccess, b.authenticated = !1
        }

        function E(a) {
            a = a.split(".")[1];
            a = a.replace("/-/g", "+");
            a = a.replace("/_/g", "/");
            switch (a.length % 4) {
                case 0:
                    break;
                case 2:
                    a += "\x3d\x3d";
                    break;
                case 3:
                    a += "\x3d";
                    break;
                default:
                    throw "Invalid token";
            }
            a = (a + "\x3d\x3d\x3d").slice(0, a.length + a.length % 4);
            a = a.replace(/-/g, "+").replace(/_/g, "/");
            a = decodeURIComponent(escape(atob(a)));
            return a = JSON.parse(a)
        }

        function K() {
            for (var a = [], b = 0; 36 > b; b++) a[b] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
            a[14] = "4";
            a[19] = "0123456789abcdef".substr(a[19] & 3 | 8, 1);
            a[8] = a[13] = a[18] = a[23] = "-";
            return a.join("")
        }

        function w(a) {
            a: {
                var c;
                switch (b.flow) {
                    case "standard":
                        c = ["code", "state", "session_state"];
                        break;
                    case "implicit":
                        c = "access_token token_type id_token state session_state expires_in".split(" ");
                        break;
                    case "hybrid":
                        c = ["access_token", "id_token", "code", "state", "session_state"]
                }
                c.push("error");c.push("error_description");c.push("error_uri");
                var e = a.indexOf("?"),
                    d = a.indexOf("#"),
                    f, g;
                "query" === b.responseMode && -1 !== e ? (f = a.substring(0, e), g = L(a.substring(e + 1, -1 !== d ? d : a.length), c), "" !== g.paramsString && (f += "?" + g.paramsString), -1 !== d && (f += a.substring(d))) : "fragment" === b.responseMode && -1 !== d && (f = a.substring(0,
                    d), g = L(a.substring(d + 1), c), "" !== g.paramsString && (f += "#" + g.paramsString));
                if (g && g.oauthParams)
                    if ("standard" === b.flow || "hybrid" === b.flow) {
                        if ((g.oauthParams.code || g.oauthParams.error) && g.oauthParams.state) {
                            g.oauthParams.newUrl = f;
                            a = g.oauthParams;
                            break a
                        }
                    } else if ("implicit" === b.flow && (g.oauthParams.access_token || g.oauthParams.error) && g.oauthParams.state) {
                    g.oauthParams.newUrl = f;
                    a = g.oauthParams;
                    break a
                }
                a = void 0
            }
            if (a) {
                if (c = A.get(a.state)) a.valid = !0, a.redirectUri = c.redirectUri, a.storedNonce = c.nonce, a.prompt =
                    c.prompt;
                return a
            }
        }

        function L(a, b) {
            a = a.split("\x26");
            for (var c = {
                    paramsString: "",
                    oauthParams: {}
                }, d = 0; d < a.length; d++) {
                var f = a[d].split("\x3d"); - 1 !== b.indexOf(f[0]) ? c.oauthParams[f[0]] = f[1] : ("" !== c.paramsString && (c.paramsString += "\x26"), c.paramsString += a[d])
            }
            return c
        }

        function l(a) {
            return !a && b.useNativePromise ? N() : O()
        }

        function N() {
            var a = {
                setSuccess: function(b) {
                    a.resolve(b)
                },
                setError: function(b) {
                    a.reject(b)
                }
            };
            a.promise = new Promise(function(b, e) {
                a.resolve = b;
                a.reject = e
            });
            return a
        }

        function O() {
            var a = {
                setSuccess: function(b) {
                    a.success = !0;
                    a.result = b;
                    a.successCallback && a.successCallback(b)
                },
                setError: function(b) {
                    a.error = !0;
                    a.result = b;
                    a.errorCallback && a.errorCallback(b)
                },
                promise: {
                    success: function(b) {
                        a.success ? b(a.result) : a.error || (a.successCallback = b);
                        return a.promise
                    },
                    error: function(b) {
                        a.error ? b(a.result) : a.success || (a.errorCallback = b);
                        return a.promise
                    }
                }
            };
            return a
        }

        function F() {
            var a = l(!0);
            if (!k.enable || k.iframe) return a.setSuccess(), a.promise;
            var c = document.createElement("iframe");
            k.iframe = c;
            c.onload = function() {
                var c = b.endpoints.authorize();
                "/" === c.charAt(0) ? (c = h.location.origin ? h.location.origin : h.location.protocol + "//" + h.location.hostname + (h.location.port ? ":" + h.location.port : ""), k.iframeOrigin = c) : k.iframeOrigin = c.substring(0, c.indexOf("/", 8));
                a.setSuccess()
            };
            var e = b.endpoints.checkSessionIframe();
            c.setAttribute("src", e);
            c.setAttribute("title", "keycloak-session-iframe");
            c.style.display = "none";
            document.body.appendChild(c);
            h.addEventListener("message", function(a) {
                if (a.origin === k.iframeOrigin && k.iframe.contentWindow === a.source && ("unchanged" ==
                        a.data || "changed" == a.data || "error" == a.data)) {
                    "unchanged" != a.data && b.clearToken();
                    for (var c = k.callbackList.splice(0, k.callbackList.length), g = c.length - 1; 0 <= g; --g) {
                        var e = c[g];
                        "error" == a.data ? e.setError() : e.setSuccess("unchanged" == a.data)
                    }
                }
            }, !1);
            return a.promise
        }

        function D() {
            k.enable && b.token && setTimeout(function() {
                B().success(function(a) {
                    a && D()
                })
            }, 1E3 * k.interval)
        }

        function B() {
            var a = l(!0);
            if (k.iframe && k.iframeOrigin) {
                var c = b.clientId + " " + (b.sessionId ? b.sessionId : "");
                k.callbackList.push(a);
                var e = k.iframeOrigin;
                1 == k.callbackList.length && k.iframe.contentWindow.postMessage(c, e)
            } else a.setSuccess();
            return a.promise
        }

        function G(a) {
            if (!a || "default" == a) return {
                login: function(a) {
                    h.location.replace(b.createLoginUrl(a));
                    return l().promise
                },
                logout: function(a) {
                    h.location.replace(b.createLogoutUrl(a));
                    return l().promise
                },
                register: function(a) {
                    h.location.replace(b.createRegisterUrl(a));
                    return l().promise
                },
                accountManagement: function() {
                    var a = b.createAccountUrl();
                    if ("undefined" !== typeof a) h.location.href = a;
                    else throw "Not supported by the OIDC server";
                    return l(!1).promise
                },
                redirectUri: function(a, c) {
                    1 == arguments.length && (c = !0);
                    return a && a.redirectUri ? a.redirectUri : b.redirectUri ? b.redirectUri : location.href
                }
            };
            if ("cordova" == a) {
                k.enable = !1;
                var c = function(a, b, c) {
                        return h.cordova && h.cordova.InAppBrowser ? h.cordova.InAppBrowser.open(a, b, c) : h.open(a, b, c)
                    },
                    e = function(a) {
                        return a && a.cordovaOptions ? Object.keys(a.cordovaOptions).reduce(function(b, c) {
                            b[c] = a.cordovaOptions[c];
                            return b
                        }, {}) : {}
                    },
                    d = function(a) {
                        return Object.keys(a).reduce(function(b, c) {
                            b.push(c +
                                "\x3d" + a[c]);
                            return b
                        }, []).join(",")
                    },
                    f = function(a) {
                        var b = e(a);
                        b.location = "no";
                        a && "none" == a.prompt && (b.hidden = "yes");
                        return d(b)
                    };
                return {
                    login: function(a) {
                        var g = l(!1),
                            e = f(a);
                        a = b.createLoginUrl(a);
                        var d = c(a, "_blank", e),
                            h = !1,
                            k = !1;
                        d.addEventListener("loadstart", function(a) {
                            0 == a.url.indexOf("http://localhost") && (a = w(a.url), v(a, g), k = !0, d.close(), h = !0)
                        });
                        d.addEventListener("loaderror", function(a) {
                            h || (0 == a.url.indexOf("http://localhost") ? (a = w(a.url), v(a, g), k = !0, d.close(), h = !0) : (g.setError(), k = !0, d.close()))
                        });
                        d.addEventListener("exit", function(a) {
                            k || g.setError({
                                reason: "closed_by_user"
                            })
                        });
                        return g.promise
                    },
                    logout: function(a) {
                        var g = l(!1);
                        a = b.createLogoutUrl(a);
                        var d = c(a, "_blank", "location\x3dno,hidden\x3dyes"),
                            e;
                        d.addEventListener("loadstart", function(a) {
                            0 == a.url.indexOf("http://localhost") && d.close()
                        });
                        d.addEventListener("loaderror", function(a) {
                            0 != a.url.indexOf("http://localhost") && (e = !0);
                            d.close()
                        });
                        d.addEventListener("exit", function(a) {
                            e ? g.setError() : (b.clearToken(), g.setSuccess())
                        });
                        return g.promise
                    },
                    register: function() {
                        var a = b.createRegisterUrl(),
                            d = f(options),
                            e = c(a, "_blank", d);
                        e.addEventListener("loadstart", function(a) {
                            0 == a.url.indexOf("http://localhost") && e.close()
                        })
                    },
                    accountManagement: function() {
                        var a = b.createAccountUrl();
                        if ("undefined" !== typeof a) {
                            var d = c(a, "_blank", "location\x3dno");
                            d.addEventListener("loadstart", function(a) {
                                0 == a.url.indexOf("http://localhost") && d.close()
                            })
                        } else throw "Not supported by the OIDC server";
                    },
                    redirectUri: function(a) {
                        return "http://localhost"
                    }
                }
            }
            if ("cordova-native" ==
                a) return k.enable = !1, {
                login: function(a) {
                    var c = l(!1);
                    a = b.createLoginUrl(a);
                    universalLinks.subscribe("keycloak", function(a) {
                        universalLinks.unsubscribe("keycloak");
                        h.cordova.plugins.browsertab.close();
                        a = w(a.url);
                        v(a, c)
                    });
                    h.cordova.plugins.browsertab.openUrl(a);
                    return c.promise
                },
                logout: function(a) {
                    var c = l(!1);
                    a = b.createLogoutUrl(a);
                    universalLinks.subscribe("keycloak", function(a) {
                        universalLinks.unsubscribe("keycloak");
                        h.cordova.plugins.browsertab.close();
                        b.clearToken();
                        c.setSuccess()
                    });
                    h.cordova.plugins.browsertab.openUrl(a);
                    return c.promise
                },
                register: function(a) {
                    var c = l(!1);
                    a = b.createRegisterUrl(a);
                    universalLinks.subscribe("keycloak", function(a) {
                        universalLinks.unsubscribe("keycloak");
                        h.cordova.plugins.browsertab.close();
                        a = w(a.url);
                        v(a, c)
                    });
                    h.cordova.plugins.browsertab.openUrl(a);
                    return c.promise
                },
                accountManagement: function() {
                    var a = b.createAccountUrl();
                    if ("undefined" !== typeof a) h.cordova.plugins.browsertab.openUrl(a);
                    else throw "Not supported by the OIDC server";
                },
                redirectUri: function(a) {
                    return a && a.redirectUri ? a.redirectUri :
                        b.redirectUri ? b.redirectUri : "http://localhost"
                }
            };
            throw "invalid adapter type: " + a;
        }
        if (!(this instanceof x)) return new x(m);
        for (var b = this, q, t = [], A, k = {
                enable: !0,
                callbackList: [],
                interval: 5
            }, u = document.getElementsByTagName("script"), r = 0; r < u.length; r++) - 1 === u[r].src.indexOf("keycloak.js") && -1 === u[r].src.indexOf("keycloak.min.js") || -1 === u[r].src.indexOf("version\x3d") || (b.iframeVersion = u[r].src.substring(u[r].src.indexOf("version\x3d") + 8).split("\x26")[0]);
        var C = !0;
        b.init = function(a) {
            debugger
            function c() {
                var c =
                    function(a) {
                        a || (d.prompt = "none");
                        b.login(d).success(function() {
                            f.setSuccess()
                        }).error(function() {
                            f.setError()
                        })
                    },
                    d = {};
                switch (a.onLoad) {
                    case "check-sso":
                        k.enable ? F().success(function() {
                            B().success(function(a) {
                                a ? f.setSuccess() : c(!1)
                            }).error(function() {
                                f.setError()
                            })
                        }) : c(!1);
                        break;
                    case "login-required":
                        c(!0);
                        break;
                    default:
                        throw "Invalid value for onLoad";
                }
            }
            b.authenticated = !1;
            a: {
                try {
                    A = new H;
                    break a
                } catch (g) {}
                A = new I
            }
            var e = ["default", "cordova", "cordova-native"];
            q = a && -1 < e.indexOf(a.adapter) ? G(a.adapter) :
                a && "object" === typeof a.adapter ? a.adapter : h.Cordova || h.cordova ? G("cordova") : G();
            if (a) {
                "undefined" !== typeof a.useNonce && (C = a.useNonce);
                "undefined" !== typeof a.checkLoginIframe && (k.enable = a.checkLoginIframe);
                a.checkLoginIframeInterval && (k.interval = a.checkLoginIframeInterval);
                b.useNativePromise = "native" === a.promiseType ? "function" === typeof Promise : !1;
                "login-required" === a.onLoad && (b.loginRequired = !0);
                if (a.responseMode)
                    if ("query" === a.responseMode || "fragment" === a.responseMode) b.responseMode = a.responseMode;
                    else throw "Invalid value for responseMode";
                if (a.flow) {
                    switch (a.flow) {
                        case "standard":
                            b.responseType = "code";
                            break;
                        case "implicit":
                            b.responseType = "id_token token";
                            break;
                        case "hybrid":
                            b.responseType = "code id_token token";
                            break;
                        default:
                            throw "Invalid value for flow";
                    }
                    b.flow = a.flow
                }
                null != a.timeSkew && (b.timeSkew = a.timeSkew);
                a.redirectUri && (b.redirectUri = a.redirectUri)
            }
            b.responseMode || (b.responseMode = "fragment");
            b.responseType || (b.responseType = "code", b.flow = "standard");
            var d = l(!1),
                f = l(!0);
            f.promise.success(function() {
                b.onReady &&
                    b.onReady(b.authenticated);
                d.setSuccess(b.authenticated)
            }).error(function(a) {
                d.setError(a)
            });
            e = M(m);
            e.success(function() {
                debugger
                var d = w(h.location.href);
                d && h.history.replaceState(h.history.state, null, d.newUrl);
                if (d && d.valid) return F().success(function() {
                    debugger
                    v(d, f)
                }).error(function(a) {
                    f.setError()
                });
                a ? a.token && a.refreshToken ? (z(a.token, a.refreshToken, a.idToken), k.enable ? F().success(function() {
                        B().success(function(a) {
                            a ? (b.onAuthSuccess && b.onAuthSuccess(), f.setSuccess(), D()) : f.setSuccess()
                        }).error(function() {
                            f.setError()
                        })
                    }) :
                    b.updateToken(-1).success(function() {
                        b.onAuthSuccess && b.onAuthSuccess();
                        f.setSuccess()
                    }).error(function() {
                        b.onAuthError && b.onAuthError();
                        a.onLoad ? c() : f.setError()
                    })) : a.onLoad ? c() : f.setSuccess() : f.setSuccess()
            });
            e.error(function() {
                d.setError()
            });
            return d.promise
        };
        b.login = function(a) {
            return q.login(a)
        };
        b.createLoginUrl = function(a) {
            var c = K(),
                e = K(),
                d = q.redirectUri(a),
                f = {
                    state: c,
                    nonce: e,
                    redirectUri: encodeURIComponent(d)
                };
            a && a.prompt && (f.prompt = a.prompt);
            A.add(f);
            var f = a && "register" == a.action ? b.endpoints.register() :
                b.endpoints.authorize(),
                g;
            g = a && a.scope ? -1 != a.scope.indexOf("openid") ? a.scope : "openid " + a.scope : "openid";
            c = f + "?client_id\x3d" + encodeURIComponent(b.clientId) + "\x26redirect_uri\x3d" + encodeURIComponent(d) + "\x26state\x3d" + encodeURIComponent(c) + "\x26response_mode\x3d" + encodeURIComponent(b.responseMode) + "\x26response_type\x3d" + encodeURIComponent(b.responseType) + "\x26scope\x3d" + encodeURIComponent(g);
            C && (c = c + "\x26nonce\x3d" + encodeURIComponent(e));
            a && a.prompt && (c += "\x26prompt\x3d" + encodeURIComponent(a.prompt));
            a && a.maxAge && (c += "\x26max_age\x3d" + encodeURIComponent(a.maxAge));
            a && a.loginHint && (c += "\x26login_hint\x3d" + encodeURIComponent(a.loginHint));
            a && a.idpHint && (c += "\x26kc_idp_hint\x3d" + encodeURIComponent(a.idpHint));
            a && a.locale && (c += "\x26ui_locales\x3d" + encodeURIComponent(a.locale));
            a && a.kcLocale && (c += "\x26kc_locale\x3d" + encodeURIComponent(a.kcLocale));
            return c
        };
        b.logout = function(a) {
            return q.logout(a)
        };
        b.createLogoutUrl = function(a) {
            return b.endpoints.logout() + "?redirect_uri\x3d" + encodeURIComponent(q.redirectUri(a, !1))
        };
        b.register = function(a) {
            return q.register(a)
        };
        b.createRegisterUrl = function(a) {
            a || (a = {});
            a.action = "register";
            return b.createLoginUrl(a)
        };
        b.createAccountUrl = function(a) {
            var c = p(),
                e = J;
            "undefined" !== typeof c && (e = c + "/account?referrer\x3d" + encodeURIComponent(b.clientId) + "\x26referrer_uri\x3d" + encodeURIComponent(q.redirectUri(a)));
            return e
        };
        b.accountManagement = function() {
            return q.accountManagement()
        };
        b.hasRealmRole = function(a) {
            var c = b.realmAccess;
            return !!c && 0 <= c.roles.indexOf(a)
        };
        b.hasResourceRole =
            function(a, c) {
                if (!b.resourceAccess) return !1;
                c = b.resourceAccess[c || b.clientId];
                return !!c && 0 <= c.roles.indexOf(a)
            };
        b.loadUserProfile = function() {
            var a = p() + "/account",
                c = new XMLHttpRequest;
            c.open("GET", a, !0);
            c.setRequestHeader("Accept", "application/json");
            c.setRequestHeader("Authorization", "bearer " + b.token);
            var e = l(!1);
            c.onreadystatechange = function() {
                4 == c.readyState && (200 == c.status ? (b.profile = JSON.parse(c.responseText), e.setSuccess(b.profile)) : e.setError())
            };
            c.send();
            return e.promise
        };
        b.loadUserInfo = function() {
            var a =
                b.endpoints.userinfo(),
                c = new XMLHttpRequest;
            c.open("GET", a, !0);
            c.setRequestHeader("Accept", "application/json");
            c.setRequestHeader("Authorization", "bearer " + b.token);
            var e = l(!1);
            c.onreadystatechange = function() {
                4 == c.readyState && (200 == c.status ? (b.userInfo = JSON.parse(c.responseText), e.setSuccess(b.userInfo)) : e.setError())
            };
            c.send();
            return e.promise
        };
        b.isTokenExpired = function(a) {
            if (!b.tokenParsed || !b.refreshToken && "implicit" != b.flow) throw "Not authenticated";
            if (null == b.timeSkew) return console.info("[KEYCLOAK] Unable to determine if token is expired as timeskew is not set"), !0;
            var c = b.tokenParsed.exp - Math.ceil((new Date).getTime() / 1E3) + b.timeSkew;
            a && (c -= a);
            return 0 > c
        };
        b.updateToken = function(a) {
            var c = l(!1);
            if (!b.refreshToken) return c.setError(), c.promise;
            a = a || 5;
            var e = function() {
                var d = !1;
                if (-1 == a) d = !0, console.info("[KEYCLOAK] Refreshing token: forced refresh");
                else if (!b.tokenParsed || b.isTokenExpired(a)) d = !0, console.info("[KEYCLOAK] Refreshing token: token expired");
                if (d) {
                    var d = "grant_type\x3drefresh_token\x26refresh_token\x3d" + b.refreshToken,
                        e = b.endpoints.token();
                    t.push(c);
                    if (1 == t.length) {
                        var g = new XMLHttpRequest;
                        g.open("POST", e, !0);
                        g.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        g.withCredentials = !0;
                        b.clientId && b.clientSecret ? g.setRequestHeader("Authorization", "Basic " + btoa(b.clientId + ":" + b.clientSecret)) : d += "\x26client_id\x3d" + encodeURIComponent(b.clientId);
                        var h = (new Date).getTime();
                        g.onreadystatechange = function() {
                            if (4 == g.readyState)
                                if (200 == g.status) {
                                    console.info("[KEYCLOAK] Token refreshed");
                                    h = (h + (new Date).getTime()) / 2;
                                    var a = JSON.parse(g.responseText);
                                    z(a.access_token, a.refresh_token, a.id_token, h);
                                    b.onAuthRefreshSuccess && b.onAuthRefreshSuccess();
                                    for (a = t.pop(); null != a; a = t.pop()) a.setSuccess(!0)
                                } else
                                    for (console.warn("[KEYCLOAK] Failed to refresh token"), 400 == g.status && b.clearToken(), b.onAuthRefreshError && b.onAuthRefreshError(), a = t.pop(); null != a; a = t.pop()) a.setError(!0)
                        };
                        g.send(d)
                    }
                } else c.setSuccess(!1)
            };
            k.enable ? B().success(function() {
                e()
            }).error(function() {
                c.setError()
            }) : e();
            return c.promise
        };
        b.clearToken = function() {
            b.token && (z(null, null, null),
                b.onAuthLogout && b.onAuthLogout(), b.loginRequired && b.login())
        };
        b.callback_id = 0;
        var H = function() {
                function a() {
                    for (var a = (new Date).getTime(), b = 0; b < localStorage.length; b++) {
                        var d = localStorage.key(b);
                        if (d && 0 == d.indexOf("kc-callback-")) {
                            var f = localStorage.getItem(d);
                            if (f) try {
                                var g = JSON.parse(f).expires;
                                (!g || g < a) && localStorage.removeItem(d)
                            } catch (y) {
                                localStorage.removeItem(d)
                            }
                        }
                    }
                }
                if (!(this instanceof H)) return new H;
                localStorage.setItem("kc-test", "test");
                localStorage.removeItem("kc-test");
                this.get = function(b) {
                    if (b) {
                        b =
                            "kc-callback-" + b;
                        var c = localStorage.getItem(b);
                        c && (localStorage.removeItem(b), c = JSON.parse(c));
                        a();
                        return c
                    }
                };
                this.add = function(b) {
                    a();
                    var c = "kc-callback-" + b.state;
                    b.expires = (new Date).getTime() + 36E5;
                    localStorage.setItem(c, JSON.stringify(b))
                }
            },
            I = function() {
                if (!(this instanceof I)) return new I;
                this.get = function(c) {
                    if (c) {
                        var d;
                        a: {
                            d = "kc-callback-" + c + "\x3d";
                            for (var e = document.cookie.split(";"), g = 0; g < e.length; g++) {
                                for (var h = e[g];
                                    " " == h.charAt(0);) h = h.substring(1);
                                if (0 == h.indexOf(d)) {
                                    d = h.substring(d.length,
                                        h.length);
                                    break a
                                }
                            }
                            d = ""
                        }
                        b("kc-callback-" + c, "", a(-100));
                        if (d) return JSON.parse(d)
                    }
                };
                this.add = function(c) {
                    b("kc-callback-" + c.state, JSON.stringify(c), a(60))
                };
                this.removeItem = function(c) {
                    b(c, "", a(-100))
                };
                var a = function(a) {
                        var b = new Date;
                        b.setTime(b.getTime() + 6E4 * a);
                        return b
                    },
                    b = function(a, b, c) {
                        a = a + "\x3d" + b + "; expires\x3d" + c.toUTCString() + "; ";
                        document.cookie = a
                    }
            }
    };
    "object" === typeof module && module && "object" === typeof module.exports ? module.exports = x : (h.Keycloak = x, "function" === typeof define && define.amd && define("keycloak", [], function() {
        return x
    }))
})(window);