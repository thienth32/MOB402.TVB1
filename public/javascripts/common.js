function checkfileImageType(selector){
    var val = $(selector).val();
    switch(val.substring(val.lastIndexOf('.') + 1).toLowerCase()){
        case 'gif': case 'jpg': case 'png':
            return true;
            break;
        default:
            return false;
            break;
    }
}