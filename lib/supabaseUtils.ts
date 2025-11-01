import { supabase } from "./supabaseClient";

  // 🔹 Create data
  export const createData = async <T>(
    table: string,
    payload: Partial<T>
  ): Promise<T[] | null> => {
    const { data, error } = await supabase.from(table).insert([payload]).select();
    if (error) {
      console.error(`Error insert data di ${table}:`, error.message);
      return null;
    }
    return data as T[];
  };

  // 🔹 Read data (all or with filters)
  export const getData = async <T>(
    table: string,
    filters?: Record<string, any>
  ): Promise<T[] | null> => {
    let query = supabase.from(table).select("*");

    if (filters) {
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });
    }

    const { data, error } = await query;
    if (error) {
      console.error(`Error ambil data dari ${table}:`, error.message);
      return null;
    }
    return data as T[];
};

// 🔹 Get single data by ID
export const getDataById = async <T>(
  table: string,
  id: string | number,
  idField: string = "id"
): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(idField, id)
    .single();
  
  if (error) {
    console.error(`Error ambil data dari ${table}:`, error.message);
    return null;
  }
  return data as T;
};

// 🔹 Update data
  export const updateData = async <T>(
    table: string,
    id: string | number,
    payload: Partial<T>,
    idField: string = "id" 
  ): Promise<T[] | null> => {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq(idField, id)
      .select();
    if (error) {
      console.error(`Error update data di ${table}:`, error.message);
      return null;
    }
    return data as T[];
  };

  // 🔹 Delete data
  export const deleteData = async (
    table: string,
    id: string | number,
    idField: string = "id"
  ): Promise<boolean> => {
    const { error } = await supabase.from(table).delete().eq(idField, id);
    if (error) {
      console.error(`Error hapus data di ${table}:`, error.message);
      return false;
    }
    return true;
  };
