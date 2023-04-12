export const init = () => {
    const availableTags = [{
        value: "WES302",
        label: "WES302",
        desc: "Desction 0",
        file: "",
        vendor: ""
    }, {
        value: "WES504",
        label: "WES504",
        desc: "Description 1",
        file: "",
        vendor: ""
    }, {
        value: "WV057C",
        label: "WV057C",
        desc: "Description 2",
        file: "",
        vendor: ""
    }];

    const split=(val) =>{
        return val.split(/;\s*/);
    }

    const extractLast=(term) =>{
        return split(term).pop();
    }

    $("#part_numbers1")
        // don't navigate away from the field on tab when selecting an item
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            minLength: 0,
            source: function (request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(availableTags, extractLast(request.term)));
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                let terms = split(this.value);
                // check if item has been selected
                let alreadySelected = false;
                terms.forEach(function (term) {
                    if (term.trim() === ui.item.value) {
                        alreadySelected = true;
                        return;
                    }
                });
                // add the selected item
                if (!alreadySelected) {
                    terms.push(ui.item.value);
                    let input = $("#" + ui.item.value);
                    input.prop("checked", true);
                    input.val(true);
                }
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join("; ");
                return false;
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            // check if item is already selected
            let input = $("#" + item.value);
            let alreadySelected = input.val() === "true";
            return $("<li></li>").data("item.autocomplete", item).append(`
              <div><input type="checkbox"${alreadySelected ? " checked" : ""}/> <a>${item.label}<br>${item.desc}</a></div>
            `).appendTo(ul).on("click", function (event) {
                // toggle checkbox and update input
                let checkbox = $(this).find("input[type=checkbox]");
                checkbox.prop("checked", !checkbox.prop("checked"));
                let input = $("#" + item.value);
                input.val(checkbox.prop("checked"));
                event.stopPropagation();
            });
        };


}