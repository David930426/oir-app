import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { mockNews } from '@/lib/mockData';
import { motion } from 'motion/react';
import Link from 'next/link';

export function Highlights() {
    return (
      <section className="max-w-6xl mx-auto px-6 lg:px-8 space-y-8">
        {/* Latest Highlights */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">OIR Bulletin</h2>
            <p className="text-muted-foreground mt-1">Latest updates, news, and opportunities for international students.</p>
          </div>
          <Link href="/bulletin" className="gap-2 group rounded-full flex items-center border px-3 py-1">
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Featured Newest Bulletin */}
        {mockNews.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden flex flex-col md:flex-row group border border-primary/20 shadow-lg hover:shadow-2xl rounded-[2rem] transition-all duration-500 bg-card/50 backdrop-blur-sm">
              <div className="md:w-3/5 relative overflow-hidden aspect-video md:aspect-auto md:min-h-95">
                <img 
                  src={mockNews[0].image} 
                  alt={mockNews[0].title} 
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {mockNews[0].isNew && (
                  <Badge className="absolute top-4 left-4 bg-red-500 animate-pulse border-none px-3 py-1 shadow-md">NEW</Badge>
                )}
                <Badge className="absolute bottom-4 right-4 bg-white text-black border-none text-sm uppercase font-bold px-4 py-1.5 shadow-lg">
                  {mockNews[0].category}
                </Badge>
              </div>
              <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center space-y-6">
                <div>
                  <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 block">
                    Latest Highlight • {mockNews[0].date}
                  </span>
                  <CardTitle className="text-2xl md:text-3xl lg:text-4xl line-clamp-3 leading-tight group-hover:text-primary transition-colors duration-300">
                    {mockNews[0].title}
                  </CardTitle>
                </div>
                <Button className="w-fit rounded-full gap-2 group/btn" size="lg">
                  Read Article <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Other Bulletins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNews.slice(1).map((news) => (
            <motion.div key={news.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
              <Card className="overflow-hidden h-full flex flex-col group border border-primary/10 shadow-md hover:shadow-xl rounded-3xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="aspect-4/3 overflow-hidden relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {news.isNew && (
                    <Badge className="absolute top-3 left-3 bg-red-500 animate-pulse border-none">NEW</Badge>
                  )}
                  <Badge className="absolute bottom-3 right-3 bg-white/90 text-black border-none text-xs uppercase font-bold px-2.5 py-1 shadow-sm">
                    {news.category}
                  </Badge>
                </div>
                <CardHeader className="p-6 space-y-3 flex-1">
                  <span className="text-sm text-muted-foreground block">{news.date}</span>
                  <CardTitle className="text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {news.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    )
}