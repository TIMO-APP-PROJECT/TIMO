export async function GET() {
  return Response.json({
    success: true,
    message: 'API 호출 성공!',
    timestamp: new Date().toISOString(),
  });
}
