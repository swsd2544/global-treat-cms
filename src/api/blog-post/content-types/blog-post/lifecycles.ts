import readingTime from 'reading-time';

interface BlogPostData {
  content?: string | object;
  readingTime?: number;
  [key: string]: any;
}

interface LifecycleEvent {
  params: {
    data: BlogPostData;
    [key: string]: any;
  };
}

const calculateReadingTime = (data: BlogPostData): void => {
  if (data.content) {
    // Calculate reading time from rich text content
    const contentText = typeof data.content === 'string' 
      ? data.content.replace(/<[^>]*>/g, '') // Remove HTML tags
      : JSON.stringify(data.content); // Handle rich text objects
    
    const stats = readingTime(contentText);
    data.readingTime = Math.ceil(stats.minutes);
  }
};

export default {
  beforeCreate(event: LifecycleEvent) {
    const { data } = event.params;
    calculateReadingTime(data);
  },

  beforeUpdate(event: LifecycleEvent) {
    const { data } = event.params;
    calculateReadingTime(data);
  },
};