type NameInput = {
  first_name?: string | null;
  firstName?: string | null;
  middle_name?: string | null;
  middleName?: string | null;
  last_name?: string | null;
  lastName?: string | null;
  prefix?: string | null;
  extension?: string | null;
};

export function formatFullname(input: NameInput): string {
  const firstName  = input.first_name  ?? input.firstName  ?? null;
  const middleName = input.middle_name ?? input.middleName ?? null;
  const lastName   = input.last_name   ?? input.lastName   ?? null;
  const prefix     = input.prefix      ?? null;
  const extension  = input.extension   ?? null;

  const parts = [
    prefix && `${prefix}.`,
    firstName,
    middleName && `${middleName[0]}.`,
    lastName,
    extension && `${extension}.`,
  ];

  return parts.filter(Boolean).join(" ");
}