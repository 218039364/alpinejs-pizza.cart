document.addEventListener("alpine:init", () => {
    Alpine.data('PizzaCart', () => {
        return {
            title: 'Pizza Cart API',
            pizzas: [],
            username: '218039364',
            cartId: '',
            cartPizzas: [],
            cartData: [],
            cartTotal: 0.00,
            login() {
        if (this.username.length > 2) {
        localStorage['username'] = this.username;
            this.createCart();
        } else {
            alert("Username is too short")
        }
     },
     logout() {
    if (confirm('Do you want to logout')) {
    this.username = '';
    this.cartId = '';
    localStorage['cartId'] = '';
    localStorage['username'] = '';
    }


     },

            createCart() {
                if (!this.username) {
                   // this.cartId = 'No username to create cart for'
                    return Promise.resolve();
                }

                const cartId = localStorage['cartId'];

                if (cartId) {
                  this.cartId = cartId;

                }
            else {
                const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                return axios.get(createCartURL)
                .then(result => {
                    this.cartId = result.data.cart_code;
                    localStorage['cartId'] = this.cartId;
                });
            }

                
           

            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
                return axios.get(getCartURL);
            },

            addPizza(PizzaId) {
                console.log(PizzaId);
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
                    "cart_code": this.cartId,
                    "pizza_id": PizzaId
                })
            },
            pay(amount) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/pay`,
                    {
                        "cart_code": this.cartId,
                        "amount": amount
                    });
            },

            showCartData() {
                this.getCart().then(result => {
                    console.log(result.data);
                    this.cartData = result.data.pizzas;
                    // console.log(this.cartData)
                    const cartData = result.data
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    // alert(this.cartTotal);
                });
            },




            init() {
            const storedUsername = localStorage['username'];
            if (storedUsername) {
                this.username = storedUsername;
            }


                axios
                    .get(`https://pizza-api.projectcodex.net/api/pizzas`)
                    .then(result => {
                        this.pizzas = result.data.pizzas
                    });

            

            if (!this.cartId) {
                this
                .createCart()
                .then(() => {
                    this.showCartData();
                })
            }
            },

                



            removePizzaFromCart(PizzaId) {
                // alert(PizzaId)
                this.removePizza(PizzaId)
                    .then(() => {
                        this.showCartData();
                    });
            },

            addPizzaToCart(PizzaId) {
                this.addPizza(PizzaId)
                    .then(() => {
                        this.showCartData()
                    })
                // // alert(PizzaId)
                // this.addPizza(PizzaId)
                //     .then(() => {
                //         this.showCartData();
                //     });
            },

            payForCart() {
                // alert("Pay now : "+ this.paymentAmount)
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);
                        }
                        else if (this.cartPizzas.length === 0) {
                            this.message = 'you cant make purchase with an empty cart';
                            setTimeout(() => {
                                this.message = '';
                            }, 3000);
                        }
                        else {
                            this.message = 'Payment Received, Enjoy!';
                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00
                                this.cartId = ''
                                this.createCart();
                                localStorage['cartId'] = '';
                                // this.createCart();
                                this.paymentAmount = 0.00
                            }, 3000);
                        }
                    }
                    )
            }
        }
});
});
