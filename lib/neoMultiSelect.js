export const init = async () => {
    const getDataFromApi = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        return data.map(({ title, id }) => ({ label: title, value: id }));
      };
    const availableTags = await getDataFromApi();
    const selectedTags = [];



    // Render selected tags in input
    const renderSelectedTags = () => {
        const MAX_DISPLAY_TAGS = 3;
        const tagTexts = selectedTags.map(tag => tag.label);
        const displayTagTexts = tagTexts.slice(0, MAX_DISPLAY_TAGS);
        const remainingTagCount = tagTexts.length - displayTagTexts.length;
        if (remainingTagCount > 0) {
            displayTagTexts.push(`...and ${remainingTagCount} more`);
        }
        console.log(displayTagTexts)
        $('#search-input').val(displayTagTexts.join(', '));
    };

    // Autocomplete functionality
    $('#search-input').autocomplete({
        source: function (request, response) {
            const filteredTags = availableTags.filter(tag => !selectedTags.includes(tag) && tag.label.toLowerCase().includes(request.term.toLowerCase()));
            response(filteredTags);
        },
        minLength: 2,
        select: function (event, ui) {
            console.log(ui.item)
            selectedTags.push(ui.item);
            $('#search-input').val('');
            renderSelectedTags();
            return false;
        },
    }).data('ui-autocomplete')._renderItem = function (ul, item) {
        const input = $(`<input type="checkbox" value="${item.value}">`).on('change', function () {
            if ($(this).is(':checked')) {
                selectedTags.push(item);
                renderSelectedTags();
            } else {
                selectedTags.splice(selectedTags.indexOf(item), 1);
                renderSelectedTags();
            }
        });
        const alreadySelected = selectedTags.includes(item);
        return $('<li></li>').data('item.autocomplete', item).append(
            $('<div></div>').append(input, item.label)
        ).toggleClass('selected', alreadySelected).appendTo(ul);
    };

    // Render selected tags on page load
    renderSelectedTags();


};