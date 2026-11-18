// ====== 1. CONFIGURE: paste your Supabase values (Project Settings > API) ======
const SUPABASE_URL = "https://fxltwlnkmgzhmyaovmfu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ME1p54WKaCjhDDSnSw3Uyw_7qtFbUdf";
// ================================================================================

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = (id) => document.getElementById(id);
const fields = ["student_id", "full_name", "program", "year_level", "email"];

function say(text, type = "ok") {
  const m = $("message");
  m.textContent = text;
  m.className = type;
}

// READ: display all saved records
async function loadStudents() {
  const { data, error } = await db.from("students").select("*").order("id", { ascending: true });
  if (error) { say("Could not load records: " + error.message, "error"); return; }
  $("count").textContent = "(" + data.length + ")";
  const tbody = $("rows");
  tbody.innerHTML = "";
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No records yet. Add a student using the form.</td></tr>';
    return;
  }
  data.forEach((s) => {
    const tr = document.createElement("tr");
    fields.forEach((f) => {
      const td = document.createElement("td");
      td.textContent = s[f];          // textContent avoids HTML injection
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    td.className = "btns";
    const edit = document.createElement("button");
    edit.className = "small"; edit.textContent = "Edit";
    edit.onclick = () => startEdit(s);
    const del = document.createElement("button");
    del.className = "small danger"; del.textContent = "Delete";
    del.onclick = () => removeStudent(s);
    td.append(edit, del);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

// CREATE and UPDATE
$("student-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const record = {};
  fields.forEach((f) => (record[f] = $(f).value.trim()));
  const rowId = $("row-id").value;

  const { error } = rowId
    ? await db.from("students").update(record).eq("id", rowId)
    : await db.from("students").insert(record);

  if (error) {
    say(error.code === "23505" ? "That Student ID already exists." : "Save failed: " + error.message, "error");
    return;
  }
  say(rowId ? "Record updated." : "Record added.");
  resetForm(false);
  loadStudents();
});

function startEdit(s) {
  $("row-id").value = s.id;
  fields.forEach((f) => ($(f).value = s[f]));
  $("form-title").textContent = "Edit student";
  $("save-btn").textContent = "Update";
  $("cancel-btn").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm(clearMsg = true) {
  $("student-form").reset();
  $("row-id").value = "";
  $("form-title").textContent = "Add student";
  $("save-btn").textContent = "Save";
  $("cancel-btn").hidden = true;
  if (clearMsg) say("");
}
$("cancel-btn").onclick = () => resetForm();

// DELETE with confirmation
async function removeStudent(s) {
  if (!confirm("Delete " + s.full_name + " (" + s.student_id + ")? This cannot be undone.")) return;
  const { error } = await db.from("students").delete().eq("id", s.id);
  if (error) { say("Delete failed: " + error.message, "error"); return; }
  say("Record deleted.");
  loadStudents();
}

loadStudents();
