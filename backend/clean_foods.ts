import { getPool } from './db.js';

async function clean() {
  try {
    const p = await getPool();
    
    // 1. Mostra i duplicati
    const [duplicates]: any = await p.execute(`
      SELECT name, user_id, COUNT(*) as count 
      FROM diet_foods 
      GROUP BY name, user_id 
      HAVING count > 1
    `);
    console.log('Duplicati trovati:', duplicates);

    if (duplicates.length > 0) {
      console.log('Pulizia in corso...');
      for (const d of duplicates) {
        // Tiene solo il record più recente per ogni duplicato
        await p.execute(`
          DELETE t1 FROM diet_foods t1
          INNER JOIN diet_foods t2 
          WHERE t1.id < t2.id 
            AND t1.name = t2.name 
            AND (t1.user_id = t2.user_id OR (t1.user_id IS NULL AND t2.user_id IS NULL))
            AND t1.name = ?
        `, [d.name]);
      }
      console.log('Pulizia completata.');
    } else {
      console.log('Nessun duplicato trovato.');
    }

  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    process.exit();
  }
}

clean();
