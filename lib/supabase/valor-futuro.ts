import { createClient } from '@/lib/supabase/client';
import { DatabaseTourSegundoSemestre } from '@/lib/supabase/types';

const supabase = createClient();

// Define a type for new tours, excluding auto-generated fields
export type NewDatabaseTourValorFuturo = Omit<DatabaseTourSegundoSemestre, 'id' | 'created_at' | 'updated_at'>;

/**
 * Fetches all tours for valor-futuro for admin purposes.
 * @returns An object containing data (list of tours) or an error.
 */
export async function getPasseiosValorFuturoAdmin(): Promise<{ data: DatabaseTourSegundoSemestre[] | null; error: any }> {
  const { data, error } = await supabase
    .from('tours_2o_semestre')
    .select('*');
  return { data, error };
}

/**
 * Fetches tours for valor-futuro that are visible on the public website.
 * @returns An object containing data (list of visible tours) or an error.
 */
export async function getPasseiosValorFuturoPublic(): Promise<{ data: DatabaseTourSegundoSemestre[] | null; error: any }> {
  const { data, error } = await supabase
    .from('tours_2o_semestre')
    .select('*')
    .eq('visivel_no_tarifario_2o_semestre', true);
  return { data, error };
}

/**
 * Updates a specific valor-futuro tour.
 * @param id The ID of the tour to update.
 * @param data The partial data to update the tour with.
 * @returns An object containing data (updated tour) or an error.
 */
export async function updatePasseioValorFuturo(
  id: string,
  data: Partial<NewDatabaseTourValorFuturo>
): Promise<{ data: DatabaseTourSegundoSemestre | null; error: any }> {
  const { data: updatedData, error } = await supabase
    .from('tours_2o_semestre')
    .update(data)
    .eq('id', id)
    .single();
  return { data: updatedData, error };
}

/**
 * Creates a new valor-futuro tour.
 * @param data The data for the new tour.
 * @returns An object containing data (newly created tour) or an error.
 */
export async function createPasseioValorFuturo(
  data: NewDatabaseTourValorFuturo
): Promise<{ data: DatabaseTourSegundoSemestre | null; error: any }> {
  const { data: newData, error } = await supabase
    .from('tours_2o_semestre')
    .insert(data)
    .single();
  return { data: newData, error };
}

/**
 * Deletes a valor-futuro tour.
 * @param id The ID of the tour to delete.
 * @returns An object containing data (null if successful) or an error.
 */
export async function deletePasseioValorFuturo(
  id: string
): Promise<{ data: null; error: any }> {
  const { error } = await supabase
    .from('tours_2o_semestre')
    .delete()
    .eq('id', id);
  return { data: null, error };
}