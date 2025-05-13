
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Youtube, Video } from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample help tutorial videos
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with Trading",
      description: "Learn the basics of cryptocurrency trading on our platform.",
      youtubeId: "dQw4w9WgXcQ",
      category: "beginner",
      duration: "5:30",
      author: "Crypto Academy",
      views: 45280,
      date: "2023-05-10"
    },
    {
      id: 2,
      title: "How to Complete KYC Verification",
      description: "Step-by-step guide to completing the KYC verification process.",
      youtubeId: "dQw4w9WgXcQ",
      category: "beginner",
      duration: "3:45",
      author: "Crypto Academy",
      views: 32150,
      date: "2023-04-22"
    },
    {
      id: 3,
      title: "Advanced Trading Strategies",
      description: "Learn advanced techniques for cryptocurrency trading.",
      youtubeId: "dQw4w9WgXcQ",
      category: "advanced",
      duration: "12:20",
      author: "Trading Experts",
      views: 18900,
      date: "2023-06-05"
    },
    {
      id: 4,
      title: "Security Best Practices",
      description: "Keep your account and assets secure with these best practices.",
      youtubeId: "dQw4w9WgXcQ",
      category: "security",
      duration: "8:15",
      author: "Security Team",
      views: 27600,
      date: "2023-05-18"
    },
    {
      id: 5,
      title: "Understanding Market Charts",
      description: "A comprehensive guide to reading and analyzing market charts.",
      youtubeId: "dQw4w9WgXcQ",
      category: "advanced",
      duration: "15:40",
      author: "Trading Experts",
      views: 12450,
      date: "2023-06-12"
    },
    {
      id: 6,
      title: "Using the Mobile App",
      description: "Navigate and use all features of our mobile application.",
      youtubeId: "dQw4w9WgXcQ",
      category: "beginner",
      duration: "6:50",
      author: "Mobile Team",
      views: 20300,
      date: "2023-05-30"
    }
  ];

  // Filter tutorials based on search term and category
  const filterTutorials = (category: string) => {
    return tutorials
      .filter(tutorial => 
        (category === 'all' || tutorial.category === category) &&
        (tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  };

  // Calculate view count for display
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-black to-zinc-900 pt-8 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
          <p className="text-gray-400 mt-2">Video tutorials and guides to help you get started</p>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 w-full md:w-1/2"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Tutorial Categories */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-8">
            <TabsTrigger value="all">All Tutorials</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* All Tutorials Tab */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTutorials('all').map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
            {filterTutorials('all').length === 0 && (
              <EmptySearchResult />
            )}
          </TabsContent>
          
          {/* Beginner Tutorials Tab */}
          <TabsContent value="beginner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTutorials('beginner').map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
            {filterTutorials('beginner').length === 0 && (
              <EmptySearchResult />
            )}
          </TabsContent>
          
          {/* Advanced Tutorials Tab */}
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTutorials('advanced').map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
            {filterTutorials('advanced').length === 0 && (
              <EmptySearchResult />
            )}
          </TabsContent>
          
          {/* Security Tutorials Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTutorials('security').map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
            {filterTutorials('security').length === 0 && (
              <EmptySearchResult />
            )}
          </TabsContent>
        </Tabs>
        
        {/* Help Contact Section */}
        <div className="mt-16 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Need more help?</h3>
              <p className="text-gray-400">Contact our support team for personalized assistance.</p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tutorial Card Component
interface Tutorial {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  duration: string;
  author: string;
  views: number;
  date: string;
}

const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card className="bg-zinc-900 border-zinc-800 text-white h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="bg-zinc-800">
            <div className="w-full h-full relative overflow-hidden rounded-t-lg">
              <img 
                src={`https://img.youtube.com/vi/${tutorial.youtubeId}/hqdefault.jpg`} 
                alt={tutorial.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="bg-red-600 bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center">
                  <Video className="h-5 w-5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-medium">
                {tutorial.duration}
              </div>
            </div>
          </AspectRatio>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-zinc-800 text-gray-300 hover:bg-zinc-700">
            {tutorial.category === 'beginner' ? 'Beginner' : 
             tutorial.category === 'advanced' ? 'Advanced' : 'Security'}
          </Badge>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Youtube className="h-3 w-3" />
            {formatViews(tutorial.views)} views
          </div>
        </div>
        <CardTitle className="text-lg mb-2">{tutorial.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {tutorial.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          By {tutorial.author}
        </div>
        <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

// Empty search result component
const EmptySearchResult = () => (
  <div className="text-center py-16">
    <BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
    <h3 className="text-xl font-medium">No tutorials found</h3>
    <p className="text-gray-400 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
  </div>
);

export default Help;
