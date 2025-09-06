import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata fields';
    displayName: 'SEO';
  };
  attributes: {
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String;
  };
}

export interface SharedSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_socials';
  info: {
    description: 'Social media links';
    displayName: 'Social';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    website: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.seo': SharedSeo;
      'shared.social': SharedSocial;
    }
  }
}
