"use strict"
let jsonData;
let checked;

function lockBackground(isOpen) {
    if (isOpen === true) {
        document.getElementById('container').style.filter = 'blur(5px)';
        document.getElementById('root').style.overflow = 'hidden';

    } else {
        document.getElementById('container').style.removeProperty('filter');
        document.getElementById('root').style.overflow = 'scroll';
    }
}

function getData() {
    lockBackground(true);
    document.getElementById('gpdrFrame').style.display = 'flex';
    document.getElementById('boxLoading').style.display = 'flex';
    fetch('https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json')
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            return responseData.vendors;
        })
        .then(data => {
            jsonData = data;
            handleVendorList();
        }).catch(err => {
            console.log(err);
        });
}

function handleVendorList() {
    document.getElementById('boxLoading').style.display = 'none';
    const vendors = jsonData;
    let target = document.getElementById("vendorList");
    Object.keys(vendors).forEach(function (key) {
        target.innerHTML += '<li class="vendorName">' + vendors[key].name + '<span class="vendorOptions"><a id="policyLink" href="' + vendors[key].policyUrl + '">Policy</a>' +
            '<label class="switch"><input type="checkbox" id="choice" name="settings" value="' + [key] + '"><span class="slider round"></span></label></span>'
        "</li>";
    });

    let checkboxes = document.querySelectorAll('input[type="checkbox"][name=settings]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            checked =
                Array.from(checkboxes)
                .filter(i => i.checked)
                .map(i => i.value)
        })
    });
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
}

function handleChoice(choice) {
    let checkedStringify = JSON.stringify(checked);
    if (choice === 'a') {
        setCookie('GPDR', "accepted:" + checkedStringify, 1);
    } else {
        setCookie('GPDR', "rejected", 1);
    }
    lockBackground(false);
    document.getElementById('gpdrFrame').style.display = 'none';
}


window.onload = (function () {
    if (getCookie("GPDR") === undefined) {
        getData();
    } else {
        lockBackground(false);
        document.getElementById('gpdrFrame').style.display = 'none';
    }
});