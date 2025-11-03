const { DataItem,DataType } = require('biz9-logic');
class Project_Logic {
    static get_query_application_development_product_type_query_filter(){
        let application_development_product_type_list = ['Admin Panel','Landing Page','Mobile','Website'];
        let query_filter = {$or:[]};
        application_development_product_type_list.forEach(item => {
            query_filter.$or.push({type:item});
        });
        return query_filter;
    };
}
module.exports = {
    Project_Logic
}
