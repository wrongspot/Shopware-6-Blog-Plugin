import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'blog',
    label: 'Blog',
    component: 'sw-cms-el-blog',
    configComponent: 'sw-cms-el-config-blog',
    previewComponent: 'sw-cms-el-preview-blog',
    defaultConfig: {
        truncate: {
            source: 'static',
            value: 30
        },
        columns: {
            source: 'static',
            value: 3
        }
    }
});
