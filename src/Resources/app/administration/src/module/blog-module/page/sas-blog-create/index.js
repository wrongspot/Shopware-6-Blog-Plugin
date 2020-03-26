import { Component, Mixin } from 'src/core/shopware';
import template from './sas-blog-create.html.twig';

import './sas-blog-create.scss';

import slugify from 'slugify';
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Link from '@editorjs/link';
import Embed from '@editorjs/embed'

Component.register('sas-blog-create', {
    template,

    inject: ['repositoryFactory'],

    mixins: [Mixin.getByName('notification')],

    data() {
        return {
            blog: {
                title: 'Undefined',
                slug: 'undefined',
                teaser: null,
                content: null,
                active: 0
            },
            configOptions: {},
            isLoading: false,
            repository: null,
            processSuccess: false
        };
    },

    created() {
        this.repository = this.repositoryFactory.create('sas_blog_entries');
        this.getBlog();
    },

    mounted() {
        this.myEditor();
    },

    watch: {
        'blog.active': function(value) {
            return this.blog.active ? 1 : 0;
        },
        'blog.title': function(value) {
            console.log(value);
            if (value != 'undefined') {
                this.blog.slug = slugify(value, {
                    lower: true
                });
            }
        }
    },

    methods: {
        getBlog() {
            this.blog = this.repository.create(Shopware.Context.api);
        },

        myEditor() {
            window.editor = new EditorJS({
                holder: "codex-editor",
                autofocus: true,
                initialBlock: "paragraph",
                tools: {
                    header: {
                        class: Header,
                        shortcut: "CMD+SHIFT+H",
                        config: {
                            placeholder: 'Enter a heading',
                            levels: [2, 3, 4],
                            defaultLevel: 3
                        }
                    },
                    list: {
                        class: List
                    },
                    paragraph: {
                        class: Paragraph,
                        config: {
                            placeholder: "."
                        }
                    },
                    warning: {
                        class: Warning,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+W',
                        config: {
                            titlePlaceholder: 'Title',
                            messagePlaceholder: 'Message',
                        },
                    },
                    Marker: {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                        },
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+O',
                        config: {
                            quotePlaceholder: 'Enter a quote',
                            captionPlaceholder: 'Quote\'s author',
                        },
                    },
                    embed: Embed,
                },

                onReady: function() {
                    console.log("ready");
                },
                onChange: () => {
                    editor.save().then(savedData => {
                        this.blog.content = savedData;
                    });
                }
            });
        },

        onClickSave() {
            this.isLoading = true;

            editor.save().then(savedData => {
                this.blog.content = JSON.stringify(savedData);
            }).then(this.repository
                .save(this.blog, Shopware.Context.api)
                .then((response) => {
                    this.isLoading = false;
                    this.$router.push({ name: 'blog.module.index' });
                })
                .catch(exception => {
                    this.isLoading = false;
                    console.log(exception);
                    this.createNotificationError({
                        title: 'TODO // ERROR',
                        message: exception
                    });
                }));

        }
    }
});
