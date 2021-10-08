const { Component, Mixin } = Shopware;
import template from './sas-blog-list.twig';
import './sas-blog-list.scss';

const Criteria = Shopware.Data.Criteria;

Component.register('sas-blog-list', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('salutation'),
        Mixin.getByName('listing')
    ],

    data() {
        return {
            categoryId: null,
            blogEntries: null,
            total: 0,
            isLoading: true,
            currentLanguageId: Shopware.Context.api.languageId
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.getList();
    },

    computed: {
        blogEntriesRepository() {
            return this.repositoryFactory.create('sas_blog_entries');
        },

        blogCategoryRepository() {
            return this.repositoryFactory.create('sas_blog_category');
        },

        columns() {
            return [
                {
                    property: 'title',
                    dataIndex: 'title',
                    label: this.$tc('sas-blog.list.table.title'),
                    routerLink: 'blog.module.detail',
                    primary: true,
                    inlineEdit: 'string'
                },
                {
                    property: 'author',
                    label: this.$tc('sas-blog.list.table.author'),
                    inlineEdit: false,
                },
                {
                    property: 'active',
                    label: this.$tc('sas-blog.list.table.active'),
                    inlineEdit: 'boolean'
                }
            ];
        }
    },

    methods: {
        changeLanguage(newLanguageId) {
            this.currentLanguageId = newLanguageId;
            this.getList();
        },

        changeCategoryId(categoryId) {
            if (categoryId && categoryId !== this.categoryId) {
                this.categoryId = categoryId;
                this.getList();
            }
        },

        getList() {
            this.isLoading = true;
            const criteria = new Criteria();
            criteria.addAssociation('author');
            criteria.addAssociation('blogCategories');

            criteria.addSorting(Criteria.sort('publishedAt', 'DESC', false))

            if (this.categoryId) {
                criteria.addFilter(Criteria.equals('blogCategories.id', this.categoryId));
            }
            return this.blogEntriesRepository.search(criteria, Shopware.Context.api).then((result) => {
                this.total = result.total;
                this.blogEntries = result;
                this.isLoading = false;
            })
        }
    }
});
