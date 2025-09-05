(() => {
    const Plugin = function (Alpine) {
        const methods = [
            {
                directive: 'request'
            },
            {
                directive: 'post',
                method: 'POST'
            },
            {
                directive: 'get',
                method: 'GET'
            },
        ]
    
        // Regiter all the aliases
        methods.forEach((type) => {
            Alpine.directive(type.directive, (el, { expression }, { evaluate, cleanup }) => {
                
                el.addEventListener('click', () => {
                    processRequest({
                        el,
                        method: type.method,
                        ...evalExpression(expression, evaluate)
                    });
                })
                cleanup(() => observer.disconnect())
            })

            Alpine.magic(type.directive, (el, { evaluate }) => expression =>{
                processRequest({
                    el,
                    method: type.method,
                    ...evalExpression(expression, evaluate)
                });
            })
        });
    
    
        function processRequest({el, method, route, headers, body}) {
            console.log({el, method, route, headers, body});

            // If the body is an object, convert to form data
            if(body !== null && typeof body === 'object' && !Array.isArray(body)) {
                body = new URLSearchParams(body).toString()
            }

            // Make the request
            fetch(route, {
                method: method ?? "POST",
                headers: method === "POST" ? {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...headers
                } : headers,
                body
            }).then((response) => {
                // Trigger the @request event.
                el.dispatchEvent(new CustomEvent('request', {
                    detail: {
                        state:'success',
                        response
                    }
                }))
                // Trigger the @ event.
                el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                    detail: {
                        state:'success',
                        response
                    }
                }))
            }).catch((error) => {
                console.warn(error);
                // Trigger the @request event.
                el.dispatchEvent(new CustomEvent('request', {
                    detail: {
                        state:'error',
                        response
                    }
                }))
                // Trigger the @ event.
                el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                    detail: {
                        state:'error',
                        response
                    }
                }))
            })
        }
    
        // Used to convert input string to object
        function evalExpression(expression, evaluate) {
            let data = {}
    
            if (!(typeof expression === 'string')) {
                data = expression;
            } else if (expression.startsWith('{')) {
                data = evaluate(expression);
            } else {
                data.route = expression;
            }
    
            return data;
        }
    }
    
    document.addEventListener("alpine:init", () => {
        window.Alpine.plugin(Plugin);
    });
})()