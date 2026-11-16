# Prodantas Online

E-commerce front-end responsivo para materiais de construção, ferramentas, tintas, elétrica e hidráulica.

## O que já está funcionando

- Busca instantânea por produto ou categoria
- Filtros por categoria e faixa de preço
- Ordenação por preço
- Carrinho lateral persistido no `localStorage`
- Controle de quantidades, subtotal e estado vazio
- CTA para atendimento no WhatsApp e checkout demonstrativo
- Layout responsivo para celular, tablet e desktop
- Logo enviada integrada em `assets/prodantas-logo.png`

## Publicação

O projeto é estático e pode ser publicado diretamente na Vercel. Para conectar pagamentos, estoque, autenticação e pedidos reais, o próximo passo é adicionar um backend (por exemplo, Supabase/Stripe ou Mercado Pago).
## Sincronização online do painel

O projeto já inclui integração opcional com Supabase para sincronizar produtos, estoque, banners e configurações entre dispositivos.

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, execute `supabase-schema.sql`.
3. Em Authentication, crie o usuário administrador com e-mail e senha.
4. Preencha `supabase-config.js` com o Project URL e a anon key.

Nunca use a chave `service_role` no navegador.

