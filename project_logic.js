const { Dataapp_dev_search_query_filterItem,DataType } = require('biz9-logic');
class Project_Logic {
    static get_query_application_development_product_type_query_filter(category){
        let application_development_product_type_list = ['Admin Panel','Landing Page','Mobile','Website'];
        let query_filter = {};
        if(!category){
            query_filter = {$or:[]};
        }else{
            query_filter = {$or:[],$and:[{category:category}]};
        }
        application_development_product_type_list.forEach(item => {
            query_filter.$or.push({type:item});
        });
        return query_filter;
    };
    static get_query_application_development_type_product_query_filter(category){
        let application_development_product_type_list = ['Admin Panel','Landing Page','Mobile','Website'];
        let query_filter = {};
        if(!category){
            query_filter = {$or:[]};
        }else{
            query_filter = {$or:[],$and:[{category:category}]};
        }
        application_development_product_type_list.forEach(item => {
            query_filter.$or.push({title:item});
        });
        return query_filter;
    };
}
module.exports = {
    Project_Logic
}
