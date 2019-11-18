function clickon() {
    var test = document.getElementById("accordionList").innerHTML = "";
    var countries = ["PL", "DE", "ES", "FR"];
    var baseApi = "https://api.openaq.org/v1/";
    var measurements = "measurements?";
    var limiNum = document.getElementById("chooseLimit").value;
    var data = document.getElementById("country").value;
    data = data.toUpperCase();
    switch (data) {
        case "POLAND":
            data = "PL";
            break;
        case "FRANCE":
            data = "FR";
            break;
        case "SPAIN":
            data = "ES";
            break;
        case "GERMANY":
            data = "DE";
            break;
        default:
            data = data;
    }
    if (limiNum > 10000) {
        alert("wartosc przekracza 10000");
    } else if (limiNum < 1) {
        alert("wartosc jest mniejsz niż 1");
    } else {
        var apiLimit = "limit=" + limiNum * 5;
        var countryCode = "&country=" + data;
        var parameterInfo = "&parameter[]=pm10";
        var orderBy = "&order_by[]=value&order_by[]=parameter";
        var sorting = "&sort[]=desc";
        var cleaned = [];
        var fullUrl = baseApi + measurements + apiLimit + parameterInfo + orderBy + countryCode + sorting;
        try {
            if (countries.includes(data)) {
                fetch(fullUrl)
                    .then(resp => resp.json())
                    .then(resp => {
                        var maxData = resp.results.length;
                        for (var a = 0; a < maxData; a++) {
                            if (a === 0) {
                                cleaned.push(resp.results[a].city);
                            } else if (cleaned.includes(resp.results[a].city)) {
                                var unique = false;
                            } else {
                                cleaned.push(resp.results[a].city);
                            }
                        };
                        for (var a = 0; a < limiNum; a++) {
                            if (cleaned[a] !== undefined) {
                                document.getElementById("accordionList").innerHTML += "<button class='accordion'>" + cleaned[a] + "</button>";
                                appendText(a);
                                description(cleaned[a], a);
                            } else {
                                document.getElementById("accordionList").innerHTML += "<p style='color:red; font-weight: bold;'> Can't find more unique elements. Returned " + a + " elements </p>";
                                break;
                            }
                        }
                    });
                $("#accordionList").css("display", "block");
            } else {
                alert("Państwo nie spełnie wymagań");
            }
        } catch (err) {
            console.log(err);
        };
    };
};

function appendText(num) {
    var txt = $("<div id='listOfAcc'"+num+"></div>");
    $("#num" + num).append(txt);
}

function description(city, num) {
    var descriptionApi = "https://en.wikipedia.org/w/api.php?action=query&prop=description&format=json&origin=*&titles=" + city;
    try {
        fetch(descriptionApi)
            .then(
                resp => resp.json())
            .then(resp => {
                //document.getElementById("accordionList").innerHTML += "<div class='panel'>" + resp.pages[0].description + "</div>";
                document.getElementById("accordionList").nextSibling.innerHTML += "<div class='panel'>" + "description" + "</div>";
            });
    } catch (err) {
        console.log(err);
    };
}

$(function () {
    var availableTags = [
            "Poland",
            "Germany",
            "Spain",
            "France"
        ];

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    $("#country")
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 1,
            source: function (req, res) {
                res($.ui.autocomplete.filter(
                    availableTags, extractLast(req.term)));
            },
            focus: function () {
                return false;
            },
            select: function (event, ui) {
                var terms = split(this.value);
                terms.pop();
                terms.push(ui.item.value);
                this.value = terms;
                return false;
            }
        });

    $(".ui-helper-hidden-accessible").css("visibility", "hidden");
});
