import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This can use Edge Runtime since it's a lightweight operation
export const runtime = 'edge';

// Initialize Supabase client for the Edge Runtime
const initSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// GET all models or a specific model by ID
export async function GET(req: NextRequest) {
  try {
    const supabase = initSupabase();
    const url = new URL(req.url);
    const modelId = url.searchParams.get('id');
    
    if (modelId) {
      // Fetch specific model
      const { data: model, error } = await supabase
        .from('models')
        .select('*')
        .eq('id', modelId)
        .single();
      
      if (error) {
        console.error('Error fetching model:', error);
        return NextResponse.json({
          success: false,
          message: error.message
        }, { status: 500 });
      }
      
      if (!model) {
        return NextResponse.json({
          success: false,
          message: 'Model not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        model
      });
    } else {
      // Fetch all models
      const { data: models, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({
          success: false,
          message: error.message
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        models
      });
    }
  } catch (error: any) {
    console.error('Error in GET models:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred getting models'
    }, { status: 500 });
  }
}

// POST to upload a new model
export async function POST(req: NextRequest) {
  try {
    const supabase = initSupabase();
    const modelData = await req.json();
    
    // Validate required fields
    if (!modelData.user_id || !modelData.name) {
      return NextResponse.json({
        success: false,
        message: 'User ID and model name are required'
      }, { status: 400 });
    }
    
    // Insert new model into Supabase
    const { data: newModel, error } = await supabase
      .from('models')
      .insert([{
        user_id: modelData.user_id,
        name: modelData.name,
        description: modelData.description,
        price: modelData.price || 0,
        category: modelData.category,
        tags: modelData.tags || [],
        file_url: modelData.file_url,
        file_path: modelData.file_path,
        file_size: modelData.file_size,
        file_type: modelData.file_type,
        thumbnail_url: modelData.thumbnail_url,
        is_public: modelData.is_public !== undefined ? modelData.is_public : true,
        status: 'active'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error uploading model:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Model uploaded successfully',
      model: newModel
    });
  } catch (error: any) {
    console.error('Error in POST model:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred uploading model'
    }, { status: 500 });
  }
} 