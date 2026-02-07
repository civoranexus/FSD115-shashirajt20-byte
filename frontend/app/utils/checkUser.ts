export default async function checkAuther(){
    const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials : "include",
        mode : "cors"
    });
    const data = await res.json();
    return data.success ? data.user : null;
}