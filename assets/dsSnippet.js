// This if for developtment (for easy code), cut this code to dsSnippet.liquid when development has done

let wishlistActivator, wishlistPopover, capsuleActivator, capsulePopover;
let myWishlistContent

jQuery(document).ready(function($) {
    const getElementValue = (id) => document.getElementById(id).value;

    const currentUrl = window.location.href;
    const customerId = $('#customerId').val();
    const storeDomain = $('#storeDomain').val();

    const shopEmail = $('#shopEmail').val();
    const shopName = $('#shopName').val();

    const appUrl = "http://staging.twixo.io/api/v1";
    // const appUrl = "http://localhost:3000/api/v1";

    // myWishlistContent = $('#my-wishlist-content');
    const myWishlistMmodal = $('#my-wishlist-modal');
    const mainContent = $('#MainContent');

    const sizeSelect = document.getElementById('size');

    const notificationModal = $('#notification-modal');
    const notificationModalDialog = document.getElementById("notification-modal-dialog")

    const btnCloseNotification = document.getElementById('btn-close-notification-modal');

    const productColumnSticky = document.querySelector('.product')

    const btnWishlistSave = document.getElementById('btn-wishlist-save');
    wishlistPopover = $('#wishlist-popover')[0];
    wishlistActivator = $('#wishlist-activator')[0];
    const wishlistContainer = document.getElementById('wishlist-container');

    capsulePopover = $('#capsule-popover')[0];
    capsuleActivator = $('#capsule-activator')[0];
    const capsuleContainer = document.getElementById('capsule-container');
    const btnAddNewCapsule = $('#btn-add-new-capsule')[0];

    const btnCloseCapsule =  $('#btn-close-capsule')[0];
    const capsuleModal = $('#capsule-modal');
    const btnCapsuleSave = document.getElementById('btn-capsule-save');

    const wishlistModal = document.getElementById('wishlist-modal');
    const addWishlistModal = document.getElementById('add-wishlist-modal');
    const btnCloseModal = $('#btn-close-modal')[0];
    const closeAddWishlist = $('#close-add-wishlist')[0];
    const btnAddNewWishlist = $('#btn-add-new-wishlist')[0];
    const btnCreateWishlist = document.getElementById('btn-create-wishlist');

    function handleWishlistClick(action) {
        wishlistActivator.innerHTML = action;
        wishlistPopover.style.display = wishlistPopover.style.display === 'block' ? 'none' : 'block';
    }

    function handleCapsuleClick(action) {
        capsuleActivator.innerHTML = action;
        capsulePopover.style.display = capsulePopover.style.display === 'block' ? 'none' : 'block';
    }

    sizeSelect.addEventListener('change', function () {
        const selectedValue = sizeSelect.value;
        const selectedIndex = sizeSelect.selectedIndex;
        document.getElementById('productSize').value = selectedValue
        document.getElementById('productVariant').value = selectedIndex
    });

    wishlistActivator.addEventListener('click', function () {
        wishlistPopover.style.display = wishlistPopover.style.display === 'block' ? 'none' : 'block';
    });

    const myWishlistActivator = $('#my-wishlist-activator');
    const myWishlistPopover = $('#my-wishlist-popover');
    const myWishlistMenu = $('#my-wishlist-menu')

    myWishlistActivator[0].addEventListener('click', function () {
        myWishlistPopover[0].style.display = myWishlistPopover[0].style.display === 'block' ? 'none' : 'block';
        console.log('myWishlistActivator')
    });
    myWishlistMenu[0].addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            var action = $(event.target).text();
            console.log('myWishlistMenu =>', action);
            $('#my-wishlist-activator').html(action);
            if (myWishlistPopover[0]) { // Check if the element exists
                myWishlistPopover[0].style.display = myWishlistPopover[0].style.display === 'block' ? 'none' : 'block';
            }
        }
    });

    const myCapsuleActivator = $('#my-capsule-activator');
    const myCapsulePopover = $('#my-capsule-popover');
    const myCapsuleMenu = $('#my-capsule-menu')

    myCapsuleActivator[0].addEventListener('click', function () {
        myCapsulePopover[0].style.display = myCapsulePopover[0].style.display === 'block' ? 'none' : 'block';
    });
    myCapsuleMenu[0].addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            var action = $(event.target).text();
            $('#my-capsule-activator').html(action);
            if (myCapsulePopover[0]) { // Check if the element exists
                myCapsulePopover[0].style.display = myCapsulePopover[0].style.display === 'block' ? 'none' : 'block';
            }
        }
    });


    btnCloseNotification.addEventListener('click', closeNotification);
    btnAddNewWishlist.addEventListener('click', showAddNewWishlist);
    closeAddWishlist.addEventListener('click', closeAddNewWishlist);
    btnAddNewCapsule.addEventListener('click', showAddNewCapsule);
    btnCloseCapsule.addEventListener('click', closeAddNewCapsule);
    btnCloseModal.addEventListener('click', closeModal);

    capsuleActivator.addEventListener('click', function () {
        capsulePopover.style.display = capsulePopover.style.display === 'block' ? 'none' : 'block';
    });

    btnWishlistSave.addEventListener('click', function () {
        var newWishlistName = document.getElementById("txtWishlist").value;
        if (newWishlistName) {
            var newListItem = document.createElement("li");
            newListItem.setAttribute("role", "menuitem");
            //newListItem.setAttribute("onclick", "handleWishlistClick('" + newWishlistName + "')");
            newListItem.textContent = newWishlistName;

            var wishlistMenu = document.getElementById("wishlist-menu");
            wishlistMenu.insertBefore(newListItem, wishlistMenu.firstChild);
            handleWishlistClick(newWishlistName)
        }

        closeAddNewWishlist()
    });

    btnCapsuleSave.addEventListener('click', function () {
        var newCapsuleName = document.getElementById("txtCapsule").value;
        if (newCapsuleName) {
            var newListItem = document.createElement("li");
            newListItem.setAttribute("role", "menuitem");
            //newListItem.setAttribute("onclick", "handleCapsuleClick('" + newCapsuleName + "')");
            newListItem.textContent = newCapsuleName;

            var capsuleMenu = document.getElementById("capsule-menu");
            capsuleMenu.insertBefore(newListItem, capsuleMenu.firstChild);
            handleCapsuleClick(newCapsuleName)
        }

        closeAddNewCapsule()
    });


    const utilityBar = $('.utility-bar__grid');

    if (utilityBar.length > 0) {
        const rightMenu = $('<div>').attr('id', 'right-menu').addClass('right-menu');
        appendMenuItem(rightMenu, "My Account");
        appendMenuItem(rightMenu, "My Wishlist");
        utilityBar.append(rightMenu);
    }

    if (customerId !== "" && storeDomain !== "" && !getCookie('wishlist')) {
        getWishlist(customerId, storeDomain);
    }
    if (customerId !== "" && storeDomain !== "" && !getCookie('capsule-unique-names')) {
        getProductCapsules(customerId, storeDomain);
    }    
    if (customerId !== "" && storeDomain !== "") {
        getStore(shopName, shopEmail);
    }

    if(getCookie('wishlist')) { // inject wistlist item
        let res = getCookie('wishlist');
        if(res) res = JSON.parse(res);
        const tmp = res.map(item => ({ _id: item._id, name: item.name }));
        tmp.forEach((e) => {
            var newListItem = document.createElement("li");
            newListItem.setAttribute("role", "menuitem");
            // newListItem.setAttribute("onclick", "handleWishlistClick('" + e + "')");
            newListItem.textContent = e.name;
            newListItem.setAttribute("data-id", e._id);
            var wishlistMenu = document.getElementById("wishlist-menu");
            wishlistMenu.insertBefore(newListItem, wishlistMenu.firstChild);
        })
    }
    //capsule-unique-names
    if(getCookie('capsule-unique-names')) { // inject capsule item
        let res = getCookie('capsule-unique-names');
        if(res) res = JSON.parse(res);
        res.forEach((e) => {
            var newListItem = document.createElement("li");
            newListItem.setAttribute("role", "menuitem");
            newListItem.textContent = e;
            var capsuleMenu = document.getElementById("capsule-menu");
            capsuleMenu.insertBefore(newListItem, capsuleMenu.firstChild);
        })
    }

    // Event listener for my-account-menu click
    $('#my-account-menu').on('click', function () {
        window.location.href = customerId === "" ? "/account/login" : "/account/";
    });

    // Event listener for btn-close-my-wishlist click
    $('#btn-close-my-wishlist').on('click', closeMyWishlist);

    // Function to append menu item
    function appendMenuItem(parent, text) {
        const menuItem = $('<div>').text(text).attr('id', text.toLowerCase().replace(/\s+/g, '-') + '-menu').addClass('right-menu');
        parent.append(menuItem);
    }

    btnCreateWishlist.addEventListener('click', async function () {
        const wishlistId = getElementValue("wishlistId");
        const productId = getElementValue("productId");
        const productName = getElementValue("productName");
        const productPrice = getElementValue("productPrice");
        const productImage = "https:" + getElementValue("productImage");
        const productUrl = getElementValue("productUrl");
        const productSize = getElementValue("productSize");
        const productVariant = Number(getElementValue("productVariant"));

        const comments = getElementValue("txtComment");
        const userId = getElementValue("customerId");
        const email = getElementValue("customerEmail");
        const first_name = getElementValue("customerFirstname");
        const last_name = getElementValue("customerLastname");
        const store = getElementValue("storeDomain");

        const name = document.getElementById("wishlist-activator").innerHTML === "No wishlist selected" ? "" : document.getElementById("wishlist-activator").innerHTML;
        const capsuleName = document.getElementById("capsule-activator").innerHTML === "No capsule selected" ? "" : document.getElementById("capsule-activator").innerHTML;

        const obj = {
            store,
            name,
            products: [{
                productId,
                productName,
                productPrice,
                productImage,
                productUrl,
                productVariant,
                productSize,
                capsule: {
                    name: capsuleName
                }
            }],
            comments: comments ? [{
                comment: comments,
                commentedBy: {
                    first_name,
                    last_name,
                    email,
                    userId
                }
            }] : undefined,
            createdBy: {
                first_name,
                last_name,
                email,
                userId
            },
            lastAdded: {
                by: {
                    first_name,
                    last_name,
                    email,
                    userId
                }
            },
            lastUpdated: {
                by: {
                    first_name,
                    last_name,
                    email,
                    userId
                }
            }
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // headers: myHeaders,
            body: JSON.stringify(obj),
            redirect: 'follow'
        };

        try {
            let isTrue = 0;
            if (obj.name === "") {
                wishlistContainer.classList.add("warning");
                isTrue++
            } else {
                wishlistContainer.classList.remove("warning");
            }
            // // comments not required
            // if (!obj.comments) {
            //     document.getElementById('txtComment').classList.add("warning")
            //     isTrue++
            // } else {
            //     document.getElementById('txtComment').classList.remove("warning");
            // }
            if (isTrue > 0) return;

            btnCreateWishlist.style.display = "none";
            document.getElementById("loader").style.display = "block"

            /*
            var settings = {
              "url": `${appUrl}/wishlist`,
              "method": "POST",
              "timeout": 0,
               "headers": {
                  "Content-Type": "application/json"
                },
              "data": obj,
            }
            $.ajax(settings).done(async function (response) {
              console.log('CREATE WISHLIST',response);
              document.getElementById("sizeAdd").innerHTML = " - Size: "+productSize;
              document.getElementById("wishlistAdd").innerHTML = name;

              await Promise.all([
                new Promise(resolve => {
                  setTimeout(() => {
                    btnCreateWishlist.style.display = "block";
                    document.getElementById("loader").style.display = "none";
                  }, 2000);
                }),
                new Promise(resolve => {
                  setTimeout(() => {
                    closeModal();
                    document.getElementById('txtComment').value = "";
                    notificationModalDialog.classList.add('animate__animated', 'animate__slideInDown');
                    showNotification();
                  }, 1000);
                }),
                new Promise(resolve => {
                  setTimeout(() => {
                    closeNotification();
                    resolve();
                  }, 5000);
                })
              ]);
            });
            */

            let response;
            if(wishlistId){
                let productObj = obj;
                delete productObj.comments;
                productObj.products[0].comments = comments ? [{
                    comment: comments,
                    commentedBy: {
                        first_name,
                        last_name,
                        email,
                        userId
                    }
                }] : undefined;

                const productData = {
                    method: 'POST',
                    // headers: myHeaders,
                    body: JSON.stringify(productObj),
                    redirect: 'follow'
                };
                response = await fetch(appUrl + "/wishlist/"+wishlistId+"/product", productData);
            }else{
                response = await fetch(appUrl + "/wishlist", requestOptions);
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            document.getElementById("sizeAdd").innerHTML = " - Size: " + productSize;
            document.getElementById("wishlistAdd").innerHTML = name;
            
            //start reload cookie
            getWishlist(customerId, storeDomain);
            getProductCapsules(customerId, storeDomain);
            //end reload cookie

            await Promise.all([
                new Promise(resolve => {
                    setTimeout(() => {
                        btnCreateWishlist.style.display = "block";
                        document.getElementById("loader").style.display = "none";
                    }, 2000);
                }),
                new Promise(resolve => {
                    setTimeout(() => {
                        closeModal();
                        document.getElementById('txtComment').value = "";
                        notificationModalDialog.classList.add('animate__animated', 'animate__slideInDown');
                        showNotification();
                    }, 1000);
                }),
                new Promise(resolve => {
                    setTimeout(() => {
                        closeNotification();
                        resolve();
                    }, 5000);
                })
            ]);

        } catch (error) {
            console.error('Error creating wishlist:', error);
        }
    });

    async function getStore(name, email) {
        try {
            const requestOptions = {
                "url": `${appUrl}/store/email?name=${name}&email=${email}`,
                "method": "GET",
                "timeout": 0,
            };
            $.ajax(requestOptions).done(function (response) {
                const res = response.data[0];
                let wishlistButton = $('#wishlist-button');

                if (res && wishlistButton.length > 0) {
                    if ([1, 3, 5].includes(res.buttonSettings.type)) {
                        wishlistButton.html('<svg style="fill: ' + res.buttonSettings.colorAfterAdded + '" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7" /></svg>');
                    }

                    if ([1, 2, 3, 4].includes(res.buttonSettings.type)) {
                        const divElement = $('<div>').html("Add to Wishlist").css({
                            fontSize: "12px",
                            color: res.buttonSettings.colorAfterAdded
                        });
                        wishlistButton.css('marginRight', '-15px').append(divElement);
                    }
                    if ([1, 2].includes(res.buttonSettings.type)) {
                        wishlistButton.css({
                            padding: "2px",
                            background: res.buttonSettings.colorBeforeAdded,
                            color: res.buttonSettings.colorAfterAdded,
                            borderRadius: "4px"
                        });
                    }
                }

                wishlistButton.on('click', customerId === '' ? redirectToLogin : showModal);

                const headerIcons = document.querySelector('.header__icons');
                if (headerIcons) {

                    if (res && res.launcherSettings.wishlistDisplayed.toLowerCase() === 'with icon') {
                        newHTML = `
                            <a style="margin-left: 1.2rem" class="header__icon header__icon--wishlist link focus-inset" id="my-wishlist-menu">
                            <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 512 512" style="font-size: 12px">
                                <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7">
                                </path>
                            </svg>
                            <span class="visually-hidden">Wishlist</span>
                            </a>
                        `;
                    } else {
                        newHTML = `
                            <a style="margin-left: 1.2rem" class="header__icon header__icon--wishlist link focus-inset" id="my-wishlist-menu">
                            <span class="">Wishlist</span>
                            </a>
                        `;
                    }

                    headerIcons.insertAdjacentHTML('beforeend', newHTML);
                    // Event listener for my-wishlist-menu click
                    $('#my-wishlist-menu').on('click', function () {
                        if (customerId !== "" && storeDomain !== "" && getCookie('wishlist')) {
                            showMyWishlist();
                        }
                    });


                }

            });


        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function getWishlist(userId, store) {

        try {
            const requestOptions = {
                "url": `${appUrl}/wishlist?userId=${userId}&store=${store}&page=1&limit=30&sort[key]=Created+Date&sort[direction]=desc`,
                "method": "GET",
                "timeout": 0,
            };

            $.ajax(requestOptions).done(function (response) {
                const res = response.data.items;
                if (res) {
                    // const tmp = res.map(item => ({ _id: item._id, name: item.name }));
                    // tmp.forEach((e) => {
                    //     var newListItem = document.createElement("li");
                    //     newListItem.setAttribute("role", "menuitem");
                    //     // newListItem.setAttribute("onclick", "handleWishlistClick('" + e + "')");
                    //     newListItem.textContent = e.name;
                    //     newListItem.setAttribute("data-id", e._id);
                    //     var wishlistMenu = document.getElementById("wishlist-menu");
                    //     wishlistMenu.insertBefore(newListItem, wishlistMenu.firstChild);
                    // })

                    const simplifiedWishlist = res.map(item => ({
                        _id: item._id,
                        store: item.store,
                        name: item.name,
                        products: item.products.map(product => ({
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productSize: product.productSize,
                            productImage: removeQueryString(product.productImage)
                        }))
                    }));

                    setCookie('wishlist', JSON.stringify(simplifiedWishlist), 1); // Save wishlist to a cookie that expires in 1 days
                    // setCookie('wishlist-unique-names', JSON.stringify(distinctNames), 1);

                }
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function getProductCapsules(userId, store) {
        try {
            const requestOptions = {
                "url": `${appUrl}/wishlist/capsule?userId=${userId}&store=${store}`,
                "method": "GET",
                "timeout": 0,
            };

            $.ajax(requestOptions).done(function (response) {
                const res = response.data;
                const uniqueNames = new Set();
                res.forEach(item => {
                    uniqueNames.add(item.capsule.name);
                });
                const distinctNames = Array.from(uniqueNames);

                // distinctNames.forEach((e) => {
                //     var newListItem = document.createElement("li");
                //     newListItem.setAttribute("role", "menuitem");
                //     newListItem.textContent = e;
                //     var capsuleMenu = document.getElementById("capsule-menu");
                //     capsuleMenu.insertBefore(newListItem, capsuleMenu.firstChild);
                // })
                setCookie('capsule-unique-names', JSON.stringify(distinctNames), 1);
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }


    if (currentUrl.includes('/products/')) {
        const productTitle = document.querySelector('.product__title');

        // Create a new div element with the wishlist-form HTML
        const wishlistForm = document.createElement('div');
        wishlistForm.innerHTML = '<div class="wishlist-form"><div id="wishlist-button" class="wishlist-button cursor-pointer"></div></div>';

        // Append the wishlistForm div to the productTitle div
        if (productTitle) productTitle.appendChild(wishlistForm);

        // Call your getStore function
        // getStore(shopName, shopEmail);
    }

    function redirectToLogin() {
        window.location.href = "/account/login";
    }

    function showModal() {
        wishlistModal.style.display = 'block';
        productColumnSticky.style.position = "relative";
        productColumnSticky.style.zIndex = -1;

        mainContent.css({
            position: 'relative',
            zIndex: -1
        });
    }

    function closeModal() {
        wishlistModal.style.display = 'none';
        productColumnSticky.style.position = "sticky"
        productColumnSticky.style.zIndex = 2;

        mainContent.css({
            position: 'sticky',
            zIndex: 2
        });
    }

    function showAddNewWishlist() {
        wishlistPopover.style.display = wishlistPopover.style.display === 'block' ? 'none' : 'block';
        addWishlistModal.style.display = 'block';
    }

    function closeAddNewWishlist() {
        addWishlistModal.style.display = 'none';
    }

    function showAddNewCapsule() {
        capsulePopover.style.display = capsulePopover.style.display === 'block' ? 'none' : 'block';
        // capsuleModal.style.display = 'block';
        capsuleModal.css({'display': 'block'});
    }

    function closeAddNewCapsule() {
        // capsuleModal.style.display = 'none';
        capsuleModal.css({'display': 'none'});
        productColumnSticky.style.position = "relative"
        productColumnSticky.style.zIndex = -1;
    }

    function closeNotification() {
        notificationModal.css({'display': 'none'});
        productColumnSticky.style.position = "sticky"
        productColumnSticky.style.zIndex = 2;

        mainContent.css({
            position: 'sticky',
            zIndex: 2
        });
    }

    function showNotification() {
        notificationModal.css({'display': 'block'});
        productColumnSticky.style.position = "relative"
        productColumnSticky.style.zIndex = -1;

        mainContent.css({
            position: 'relative',
            zIndex: -1
        });

    }

    // Function to remove query string from URL
    function removeQueryString(url) {
        return url.split('?')[0];
    }

    // Function to show wishlist modal
    function showMyWishlist() {
        let tmp = getCookie('wishlist');
        tmp = JSON.parse(tmp);
        let idx = 0;
        myWishlistContent.html("")
        tmp.forEach(function (item, index) {
            let i = index + 1;
            let wishlistWrap;
            if (i % 3 === 1) {
                idx++;
                wishlistWrap = document.createElement('div');
                wishlistWrap.className = "wishlist-content"
                wishlistWrap.innerHTML = '<div id="wrap-' + idx + '" class="flex flex-wrap mx-auto"></div>';
                myWishlistContent.append(wishlistWrap);

            } else {}
            wishlistWrap = document.getElementById('wrap-' + idx);
            const productImage = [];
            let imageCount=0;
            item.products.forEach((e) => { 
                imageCount++
                if(imageCount <= 3) productImage.push(`<img src="${e.productImage}" class="w-full h-full object-cover mb-4" />`)
            })

            const wishlistItemHTML = `
                <div class="wishlist-item bg-white m-4 p-4 shadow-md flex flex-col w-full h-full justify-center" data-id=${item._id}>
                    <div class="flex justify-between px-5 py-3 w-full mb-auto">
                        <div class="flex align-center">
                            <h6 class="name m-0">${item.name}</h6>
                        </div>

                        <div class="btn-share cursor-pointer flex justify-end align-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path
                                d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" />
                            </svg>
                        </div>
                    </div>

                    <div class="flex gap-4 item-${item.products.length <= 2 ? item.products.length : 3}">
                        ${productImage.join('')}
                    </div>
                    <div class="mt-5">
                        <p class="p-0 m-0 view">${item.products.length} product</p>
                        <p class="p-0 m-0 view">VIEW LIST</p>
                    </div>
                </div>
            `;

            var div = document.createElement('div');
            div.classList.add("flex", "w-full", "md:w-1/3", "mb-4")
            
            div.innerHTML = wishlistItemHTML

            wishlistWrap.append(div)
        })

        myWishlistMmodal.css('display', 'block');
        mainContent.css({
            position: 'relative',
            zIndex: -1
        });
    }

    function handleCapsuleClick(action) {
        capsuleActivator.innerHTML = action;
        capsulePopover.style.display = capsulePopover.style.display === 'block' ? 'none' : 'block';
    }


    // Function to close wishlist modal
    function closeMyWishlist() {
        myWishlistMmodal.css('display', 'none');
        mainContent.css({
            position: 'sticky',
            zIndex: 2
        });
    }

    // Function to set a cookie
    function setCookie(name, value, daysToExpire) {
        const expires = new Date();
        expires.setTime(expires.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Function to get a cookie by name
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }

    // Function to delete a cookie by name
    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }


});

$(document).on('click', '#wishlist-menu li', function () {
    var action = $(this).text();
    var dataId = $(this).data('id'); 
    console.log('wishlist-menu li wkwkwk')
    document.getElementById('wishlistId').value = dataId ? dataId : "";
    wishlistActivator.innerHTML = action;
    wishlistPopover.style.display = wishlistPopover.style.display === 'block' ? 'none' : 'block';
});

$(document).on('click', '#capsule-menu li', function () {
    var action = $(this).text();
    capsuleActivator.innerHTML = action;
    capsulePopover.style.display = capsulePopover.style.display === 'block' ? 'none' : 'block';
});

$(document).on('click', '.wishlist-item', function () {
    var wishlistContents = document.querySelectorAll('.wishlist-content');
    wishlistContents.forEach(function(element) {
        element.classList.add('hidden');
    });


});