import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {S1} from './data-set1';
import {S2} from './data-set2';

export const dynamic='force-dynamic';

export async function GET(req) {
  try {
    const {searchParams}=new URL(req.url);
    const vipSet=searchParams.get('vipSet');
    const userId=searchParams.get('userId');
    
    if(!vipSet) return NextResponse.json({error:'Missing params'},{status:400});
    const norm=vipSet.toLowerCase();
    
    // 1. Load the authentic master data directly from your tiny static files
    let masterData = norm.includes('set2') ? S2 : S1;
    
    // 2. Fetch the global custom overrides from the database if they exist
    // We search using userId: 'system' or another identifier that we can seed later,
    // but for now, we read directly from your static master files to prevent any relation crashes.
    let finalProducts = masterData.map(p => ({
      id: p.id,
      taskOrder: p.taskOrder || p.id,
      name: p.name,
      price: parseFloat(p.price || 0),
      image: p.image || `/vip1/${norm.includes('set2') ? 'set2' : 'set1'}/photo${p.taskOrder || p.id}.jpg`,
      rating: p.rating || 5
    }));

    // 3. ADMIN MERGE VIEW: If a userId is passed, isolate ONLY the rows that are currently merged for this user
    if(userId){
      const active = await prisma.taskMerge.findFirst({
        where: { userId, vipSet: norm, status: 'active' },
        orderBy: { createdAt: 'desc' }
      });
      
      if(active){
        const upairs = typeof active.pairs === 'string' ? JSON.parse(active.pairs) : active.pairs;
        const targets = upairs.map(p => p.taskOrder);
        
        // Filter down to the exact task orders selected in the photo step
        let mergedSubset = finalProducts.filter(p => targets.includes(p.taskOrder));
        
        // Map any custom prices or names already saved by the admin inside this active row snapshot
        return NextResponse.json(mergedSubset.map(p => {
          const match = upairs.find(u => u.taskOrder === p.taskOrder);
          return {
            ...p,
            name: match?.name || p.name,
            price: match?.price ? parseFloat(match.price) : p.price
          };
        }));
      }
    }
    
    return NextResponse.json(finalProducts);
  } catch(e) {
    console.error("GET DATA LAYER ERROR:", e);
    return NextResponse.json({error:e.message},{status:500});
  }
}
