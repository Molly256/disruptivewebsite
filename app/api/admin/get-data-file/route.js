import {NextResponse} from 'next/server';import {prisma} from '@/lib/prisma';
import {S1} from './data-set1';import {S2} from './data-set2';
export const dynamic='force-dynamic';

export async function GET(req) {
  try {
    const {searchParams}=new URL(req.url);const vipSet=searchParams.get('vipSet');const userId=searchParams.get('userId');
    if(!vipSet)return NextResponse.json({error:'Missing params'},{status:400});
    const norm=vipSet.toLowerCase();
    
    let rec=await prisma.taskMerge.findFirst({where:{vipSet:norm,status:'system_template'}});
    if(!rec){
      const base=norm.includes('set2')?S2:S1;
      rec=await prisma.taskMerge.create({data:{userId:'system_inventory',vipSet:norm,pairs:base,status:'system_template'}});
    }
    
    let data=typeof rec.pairs==='string'?JSON.parse(rec.pairs):rec.pairs;
    if(userId){
      const active=await prisma.taskMerge.findFirst({where:{userId,vipSet:norm,status:'active'},orderBy:{createdAt:'desc'}});
      if(active){
        const upairs=typeof active.pairs==='string'?JSON.parse(active.pairs):active.pairs;
        const targets=upairs.map(p=>p.taskOrder);
        return NextResponse.json(data.filter(p=>targets.includes(p.taskOrder)));
      }
    }
    return NextResponse.json(data);
  }catch(e){return NextResponse.json({error:e.message},{status:500})}
}
